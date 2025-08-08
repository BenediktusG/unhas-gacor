import { db } from "../application/database.js";
import { BadRequestError } from "../error/bad-request-error.js";
import { spinValidation } from "../validation/game-validation.js";
import { validate } from "../validation/validation.js";

const generateLosePattern = () => {
    const resultArr = [];
    const firstNumber = Math.floor(Math.random()*10);
    resultArr.push(firstNumber);
    for (let i = 1; i < 5; i++) {
        let nextNumber = Math.floor(Math.random()*10);
        if (i == 2 && resultArr[0] === resultArr[1]) {
            while (nextNumber === firstNumber) {
                nextNumber = Math.floor(Math.random()*10);
            }
        }
        resultArr.push(nextNumber);
    }
    return resultArr;
};

const spin = async (request, user) => {
    const { betAmount } = validate(spinValidation, request);
    let { money } = (await db.collection('user-profile').doc(user.uid).get()).data();
    if (money < betAmount) {
        throw new BadRequestError('Bet amount exceeds current balance', 'INSUFFICIENT_BALANCE');
    }
    money -= betAmount;
    const prob = Math.random();
    let resultArr = [];
    let prize;
    if (prob < 0.5) {
        resultArr = generateLosePattern();
        prize = 0;
    } else if (prob < 0.8) {
        const winningNumber = Math.floor(Math.random()*10);
        for (let i = 0; i < 3; i++) {
            resultArr.push(winningNumber);
        }
        let nextNumber = Math.floor(Math.random()*10);
        while(nextNumber === winningNumber) {
            nextNumber = Math.floor(Math.random()*10);
        }
        resultArr.push(nextNumber);
        resultArr.push(Math.floor(Math.random()*10));
        prize = winningNumber*betAmount;
        if (prize + money >= 50000000) {
            prize = 0;
            resultArr = generateLosePattern();
        }
    } else if (prob < 0.95) {
        const winningNumber = Math.floor(Math.random()*10);
        for (let i = 0; i < 4; i++) {
            resultArr.push(winningNumber);
        }
        let nextNumber = Math.floor(Math.random()*10);
        while(nextNumber === winningNumber) {
            nextNumber = Math.floor(Math.random()*10);
        }
        prize = winningNumber*betAmount*2;
        if (prize + money >= 50000000) {
            prize = 0;
            resultArr = generateLosePattern();
        }
    } else {
        const winningNumber = Math.floor(Math.random()*10);
        for (let i = 0; i < 4; i++) {
            resultArr.push(winningNumber);
        }
        prize = winningNumber*betAmount*5;
        if (prize + money >= 50000000) {
            prize = 0;
            resultArr = generateLosePattern();
        }
    }
    money += prize;
    await db.collection('user-profile')
        .doc(user.uid)
        .update({
            money: money,
        });
    
    for (let i = 0; i < 5; i++) {
        resultArr[i]--;
    }
    return {
        reward: prize,
        balance: money,
        result: resultArr,
    };
};

export default {
    spin,
}