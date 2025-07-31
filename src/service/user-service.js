import { db } from "../application/database.js";
import { AuthorizationError } from "../error/authorizationError.js";

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

export default {
    getMoney,
    checkBonusAvailability,
    claimBonus,
};