import { db } from "../application/database.js";
import { AuthorizationError } from "../error/authorizationError.js";
import { ConflictError } from "../error/conflict-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { getTodayDate } from "../helper/get-today-date.js";

const getMoney = async (user) => {
  const { money } = (
    await db.collection("user-profile").doc(user.uid).get()
  ).data();
  return {
    money: money,
  };
};

// Cooldown period for claiming bonuses (24 hours)
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const asDate = (v) =>
  v ? (typeof v?.toDate === "function" ? v.toDate() : new Date(v)) : null;

const checkBonusAvailability = async (user) => {
  const ref = db.collection("user-profile").doc(user.uid);
  const snap = await ref.get();
  if (!snap.exists)
    throw new ConflictError("User profile not found", "INCOMPLETE_PROFILE");

  const data = snap.data();
  const last = asDate(data.lastBonusTimestamp);
  const now = new Date();

  const elapsed = last ? now - last : Infinity;
  const eligible = elapsed >= COOLDOWN_MS;

  const remainingMs = eligible ? 0 : COOLDOWN_MS - elapsed;
  const nextEligibleAt = eligible ? now : new Date(now.getTime() + remainingMs);

  return {
    eligible,
    lastBonusTimestamp: last ? last.toISOString() : null,
    nextEligibleAt: nextEligibleAt.toISOString(),
    message: eligible
      ? "Bonus tersedia!"
      : "Belum 24 jam sejak klaim terakhir.",
  };
};

const claimBonus = async (user) => {
  const ref = db.collection("user-profile").doc(user.uid);
  const snap = await ref.get();
  if (!snap.exists)
    throw new ConflictError("User profile not found", "INCOMPLETE_PROFILE");

  const data = snap.data();
  const last = asDate(data.lastBonusTimestamp);
  const now = new Date();

  const elapsed = last ? now - last : Infinity;
  if (elapsed < COOLDOWN_MS) {
    const remainingMs = COOLDOWN_MS - elapsed;
    const nextEligibleAt = new Date(now.getTime() + remainingMs);
    throw new AuthorizationError(
      `Sudah klaim. Coba lagi setelah 24 jam (pada ${nextEligibleAt.toISOString()}).`,
      "UNAUTHORIZED_ACTION"
    );
  }

  const bonusAmount = 100000;
  const newMoney = (data.money ?? 0) + bonusAmount;

  await ref.update({
    money: newMoney,
    lastBonusTimestamp: now,
  });

  return {
    bonus: bonusAmount,
    money: newMoney,
    lastBonusTimestamp: now.toISOString(),
    nextEligibleAt: new Date(now.getTime() + COOLDOWN_MS).toISOString(),
    message: "Berhasil klaim! Bisa klaim lagi setelah 24 jam.",
  };
};

const registerProfile = async (request, user) => {
  console.log(request);
  const { fullName } = validate(registerUserValidation, request);
  await db.collection("user-profile").doc(user.uid).set({
    fullName: fullName,
    money: 0,
  });
};

const getProfile = async (user) => {
  const profile = (
    await db.collection("user-profile").doc(user.uid).get()
  ).data();
  if (!profile) {
    throw new ConflictError("missing user information", "INCOMPLETE_PROFILE");
  }
  return profile;
};

export default {
  getMoney,
  checkBonusAvailability,
  claimBonus,
  registerProfile,
  getProfile,
};
