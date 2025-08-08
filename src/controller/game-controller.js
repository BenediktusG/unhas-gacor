import gameService from "../service/game-service"

const spin = async (req, res, next) => {
    try {
        const result = await gameService.spin(req.body, req.user);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

export default {
    spin,
};