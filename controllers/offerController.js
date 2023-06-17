const {
    ComplexOffer,
    ComplexOfferGoods,
    Good,
    Brand,
    Rating,
    GoodImages
} = require('../modules/models');
const ApiError = require('../error/ApiError');
const staticManagement = require('../helpers/staticManagement')

class offerController {
    async postOffer(req, res, next) {
        try {
            let { id, name, price, description, goods } = req.body;
            let image;
            let fileName

            if (req.files && req.files.image) {
                image = req.files.image
                fileName = staticManagement.staticCreate(image)
            }
            let complexOffer;
            if (id) {

                staticManagement.staticDelete(await ComplexOffer.findOne({ where: { id: id } }))
                complexOffer = await ComplexOffer.update(
                    {
                        name: name,
                        price: price,
                        description: description,
                        image: fileName
                    },
                    {
                        where: {
                            id: id
                        }
                    }
                );
                if (goods) {
                    goods = JSON.parse(goods)
                    ComplexOfferGoods.destroy({ where: { complexOfferId: id } })
                    goods.forEach(async good => {
                        const goodExists = await Good.findOne({ where: { id: good.goodId } })
                        if (!goodExists) next(ApiError.badRequest("Товара не существует"));
                        else {
                            ComplexOfferGoods.create({
                                count: good.count,
                                goodId: good.goodId,
                                complexOfferId: id
                            })
                        }

                    })
                }
            }
            else {
                complexOffer = await ComplexOffer.create({
                    name: name,
                    price: price,
                    description: description,
                    image: fileName
                });

                if (goods) {
                    goods = JSON.parse(goods)
                    goods.forEach(async good => {
                        const goodExists = await Good.findOne({ where: { id: good.goodId } })
                        if (!goodExists) next(ApiError.badRequest("Товара не существует"));
                        else {
                            ComplexOfferGoods.create({
                                count: good.count,
                                goodId: good.goodId,
                                complexOfferId: complexOffer.id
                            })
                        }
                    })
                }
            }
            return res.json(complexOffer);

        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

    async getAll(req, res, next) {
        try {
            const complexOffer = await ComplexOffer.findAndCountAll({
                order: [
                    ['name', 'ASC']],
                distinct: true
            })
            return res.json(complexOffer);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const complexOffer = await ComplexOffer.findOne(
                {
                    where: { id },
                    include: [{
                        model: ComplexOfferGoods,
                        include: [{
                            model: Good, include: [
                                { model: Brand },
                                { model: Rating },
                                { model: GoodImages }
                            ]
                        }]
                    }]
                },
            )
            return res.json(complexOffer)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOffer(req, res, next) {
        try {
            let { id } = req.body;
            staticManagement.staticDelete(await ComplexOffer.findOne({ where: { id: id } }))

            const complexOffer = await ComplexOffer.destroy({
                where: {
                    id: id
                }
            });
            return res.json(complexOffer);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteGoodAtOffer(req, res, next) {
        try {
            let { id } = req.body;
            const complexOfferGoods = await ComplexOfferGoods.destroy({
                where: {
                    id: id
                }
            });
            return res.json(complexOfferGoods);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
}

module.exports = new offerController();