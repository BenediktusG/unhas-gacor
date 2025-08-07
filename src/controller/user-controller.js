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

const claimBonus = async (req, res, next) => {
    try {
        const result = await userService.checkBonusAvailability(req.user);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const registerProfile = async (req, res, next) => {
    try {
        const result = await userService.registerProfile(req.body, req.user);
        res.status(201).json({
            success: true,
            data: {
                message: 'Register success',
            },
        });
    } catch (e) {
        next(e);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const result = await userService.getProfile(req.user);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

export default {
    getMoney,
    checkBonusAvailability,
    claimBonus,
    registerProfile,
    getProfile,
};