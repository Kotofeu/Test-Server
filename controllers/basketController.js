const {
    Good,
    GoodImages,
    Brand,
    Rating,
    Basket,
} = require('../modules/models');
const ApiError = require('../error/ApiError');

class basketController {
    async postGoogInBasket(req, res, next) {
        try {
            const {
                goodId,
                count = 1
            } = req.body;
            const userId = req.user.id

            let goodInBasket;
            let oldCount;
            oldCount = await Basket.findOne({ where: { userId, goodId } })
            if (oldCount) {
                const newCount = await Basket.update(
                    {
                        count
                    },
                    { where: { id: oldCount.id } }
                );
                return res.json(newCount);
            }
            else {
                goodInBasket = await Basket.create({ userId, goodId, count });
            }
            return res.json(goodInBasket);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
    async getUserBasket(req, res, next) {
        const userId = req.user.id
        let goodInBasket;
        if (!userId){
            next(ApiError.badRequest("Не задан userId"));
        }
        try {
            if (userId) {
                goodInBasket = await Basket.findAndCountAll({
                    include: [{
                        model: Good,
                        include: [
                            { model: Brand },
                            { model: Rating },
                            { model: GoodImages }
                        ],
                        order: [
                            [{ model: GoodImages }, "id", 'ASC']
                        ]
                    }],
                    distinct: true,
                    where: { userId },
                    order: [['id', 'ASC']],

                })

            }
            else {
                goodInBasket = await Basket.findAndCountAll({
                    order: [['id', 'ASC']],
                    distinct: true,
                })
            }
            return res.json(goodInBasket);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async isGoodInUserBasket(req, res, next) {
        const {  goodId} = req.query;
        const userId = req.user.id

        if (!userId || !goodId){
            next(ApiError.badRequest("Не передан goodId"));
        }
        try {
            const goodInBasket = await Basket.findOne({where: {userId, goodId}})
            if (!goodInBasket) {
                return res.json(false);
            }
            return res.json(true);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteGoodInBasket(req, res, next) {
        try {
            const userId = req.user.id
            const { goodId } = req.body;
            const goodInBasket = await Basket.destroy({
                where: {
                    goodId,
                    userId
                }
            });
            return res.json(goodInBasket);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
   
}

module.exports = new basketController();