import { db } from "../application/database.js";
import { AuthorizationError } from "../error/authorizationError.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";

const getMoney = async(user) => {
    let moneyDoc = await db.collection("money").doc(user.uid).get();
    if (!moneyDoc) {
        await db.collection("money").doc(user.uid).set(0);
        moneyDoc = 0;
    }
    return {
        money: moneyDoc,
    };
};

const checkBonusAvailability = async (user) => {
    let balance = await db.collection("money").doc(user.uid).get();
    if (!balance) {
        await db.collection("money").doc(user.uid).set(0);
        balance = 0;
    }
    if (balance < 100.000) {
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
    let balance = await db.collection("money").doc(user.uid).get();
    if (!balance) {
        await db.collection("money").doc(user.uid).set(0);
        balance = 0;
    }
    if (balance > 100000) {
        throw new AuthorizationError('Access denied', 'UNAUTHORIZED_ACTION');
    }
    balance += 100000;
    await db.collection("money").doc(user.uid).set(balance);
    return {
        bonus: 100000,
        balance: balance,
    };
};

const registerProfile = async (request, user) => {
    const { fullName } = validate(registerUserValidation, request);
    await db.collection('user-profile').doc(user.uid).set({
        fullName: fullName,
        money: 0,
    });
};

export default {
    getMoney,
    checkBonusAvailability,
    claimBonus,
};