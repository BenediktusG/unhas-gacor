import { db } from '../application/database.js';
import { AuthorizationError } from '../error/authorizationError.js';
import { ConflictError } from '../error/conflict-error.js';
import { registerUserValidation } from '../validation/user-validation.js';
import { validate } from '../validation/validation.js';

const getMoney = async (user) => {
  const { money } = await db.collection('user-profile').doc(user.uid).get().data();
  return {
    money: money,
  };
};

const checkBonusAvailability = async (user) => {
  const { money } = (await db.collection('user-profile').doc(user.uid).get()).data();
  if (money < 100.0) {
    return {
      eligible: true,
    };
  } else {
    return {
      eligible: false,
    };
  }
};

const claimBonus = async (user) => {
  const { money } = (await db.collection('user-profile').doc(user.uid).get()).data();
  if (money > 100000) {
    throw new AuthorizationError('Access denied', 'UNAUTHORIZED_ACTION');
  }
  await db
    .collection('money')
    .doc(user.uid)
    .set(money + 100000);
  return {
    bonus: 100000,
    money: money + 100000,
  };
};

const registerProfile = async (request, user) => {
  console.log(request);
  const { fullName } = validate(registerUserValidation, request);
  await db.collection('user-profile').doc(user.uid).set({
    fullName: fullName,
    money: 0,
  });
};

const getProfile = async (user) => {
  const profile = (await db.collection('user-profile').doc(user.uid).get()).data();
  if (!profile) {
    throw new ConflictError('missing user information', 'INCOMPLETE_PROFILE');
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
