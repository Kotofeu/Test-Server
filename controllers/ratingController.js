const {
    User,
    RatingImage,
    Rating,
    Good
} = require('../modules/models');
const staticManagement = require('../helpers/staticManagement')

const ApiError = require('../error/ApiError');
class ratingController {
    async postRating(req, res, next) {
        try {
            let {
                id,
                rating,
                goodId,
                comment
            } = req.body;
            if (rating > 5) rating = 5
            if (rating < 0) rating = 0
            const userId = req.user.id

            let oldRating;
            if (!id) {
                oldRating = await Rating.findOne({ where: { userId, goodId } })

            }
            if (oldRating) {
                id = oldRating.id
            }

            let imagesNames = [];
            let images;
            console.log(req.files)
            if (req.files && req.files.images) {

                images = req.files.images
                imagesNames = staticManagement.manyStaticCreate(images);
            }
            let ratingModel;
            if (id) {
                ratingModel = await Rating.update(
                    {
                        rating,
                        comment
                    },
                    { where: { id: id } }
                );
                if (images) {
                    staticManagement.manyStaticDelete(await RatingImage.findAll({ where: { ratingId: id } }))
                    RatingImage.destroy({ where: { ratingId: id } })
                    imagesNames.forEach(image => RatingImage.create(
                        {
                            ratingId: id,
                            image
                        }
                    ))
                }
            }
            else {
                ratingModel = await Rating.create(
                    {
                        rating,
                        comment,
                        userId,
                        goodId
                    }
                );

                if (images) {
                    imagesNames.forEach(image => RatingImage.create(
                        {
                            ratingId: ratingModel.id,
                            image
                        }
                    ))
                }

            }
            return res.json(ratingModel);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
    async getAllRatingByGood(req, res, next) {
        const { goodId, limit = 10, page = 1, rating } = req.query;
        if (!goodId) {
            next(ApiError.badRequest("Не указан goodId"));
        }
        const offset = page * limit - limit
        let ratingModel;
        const where = {}
        try {
            where.goodId = goodId
            if (rating) where.rating = rating
            ratingModel = await Rating.findAndCountAll({
                order: [['id', 'DESC']],
                include: [{ model: RatingImage }, { model: User }],
                distinct: true,
                where,
                limit,
                offset
            })

            return res.json(ratingModel);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAllRatingByUser(req, res, next) {
        let { userId } = req.query;

        let ratingModel;
        if (!userId) {
            next(ApiError.badRequest("Не указан userId"));
        }

        try {
            ratingModel = await Rating.findAndCountAll({
                order: [['createdAt', 'ASC']],
                include: [{ model: RatingImage }, { model: Good }],
                distinct: true,
                where: {
                    userId: userId
                }
            })
            return res.json(ratingModel);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteRating(req, res, next) {

        try {
            const userId = req.user.id
            const { ratingId, imageId } = req.body;
            if (!userId || !ratingId) {
                return res.json("Ошибка получения id пользователя и/или не передан id рейтинга");
            }
            let rating = await Rating.findOne({ where: { userId, id: ratingId } })
            if (!rating) return res.json("Оценка не принадлежит пользователю");
            if (imageId) {
                staticManagement.staticDelete(await RatingImage.findOne({ where: { ratingId: ratingId, id: imageId } }))
                const goodImage = await RatingImage.destroy({
                    where: {
                        id: imageId,
                        ratingId: ratingId
                    }
                });
                return res.json(goodImage);
            }
            rating = await Rating.findAll({ where: { userId, id: ratingId } })

            staticManagement.manyStaticDelete(await RatingImage.findAll({ where: { ratingId: ratingId } }))
            const ratingModel = await Rating.destroy({
                where: {
                    id: ratingId,
                    userId
                }
            });
            return res.json(ratingModel);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

}

module.exports = new ratingController();