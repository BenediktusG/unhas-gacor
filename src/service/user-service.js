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

const checkBonusAvailability = async (user) => {
  const userRef = db.collection("user-profile").doc(user.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new ConflictError("User profile not found", "INCOMPLETE_PROFILE");
  }

  const userData = userSnap.data();
  const todayDate = getTodayDate();

  const lastBonusDate = userData.lastBonusDate || null;
  const hasClaimedToday = lastBonusDate === todayDate;

  return {
    eligible: !hasClaimedToday,
    lastBonusDate: lastBonusDate,
    todayDate: todayDate,
    message: hasClaimedToday
      ? "You have already claimed your daily bonus today"
      : "Daily bonus available!",
  };
};

const claimBonus = async (user) => {
  const userRef = db.collection("user-profile").doc(user.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new ConflictError("User profile not found", "INCOMPLETE_PROFILE");
  }

  const userData = userSnap.data();
  const todayDate = getTodayDate();
  const lastBonusDate = userData.lastBonusDate || null;

  if (lastBonusDate === todayDate) {
    throw new AuthorizationError(
      "You have already claimed your daily bonus today. Come back tomorrow!",
      "UNAUTHORIZED_ACTION"
    );
  }

  const currentMoney = userData.money || 0;
  const bonusAmount = 100000;
  const newMoney = currentMoney + bonusAmount;

  await userRef.update({
    money: newMoney,
    lastBonusDate: todayDate,
    lastBonusTimestamp: new Date(),
  });

  return {
    bonus: bonusAmount,
    money: newMoney,
    previousMoney: currentMoney,
    bonusDate: todayDate,
    message:
      "Daily bonus claimed successfully! Come back tomorrow for another bonus.",
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
