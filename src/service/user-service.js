import { db } from "../application/database.js";

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

export default {
    getMoney
};