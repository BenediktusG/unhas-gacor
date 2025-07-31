import userService from "../service/user-service";

const getMoney = async (req, res, next) => {
    const result = await userService.getMoney(req.user);
    res.status(200).json({
        success: true,
        data: result,
    });
};

export default {
    getMoney,
};