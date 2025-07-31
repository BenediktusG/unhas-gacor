import userService from "../service/user-service.js";

const getMoney = async (req, res) => {
    const result = await userService.getMoney(req.user);
    res.status(200).json({
        success: true,
        data: result,
    });
};

const checkBonusAvailability = async (req, res) => {
    const result = await userService.checkBonusAvailability(req.user);
    res.status(200).json({
        success: true,
        data: result,
    });
};

export default {
    getMoney,
    checkBonusAvailability,
};