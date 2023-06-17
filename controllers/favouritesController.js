const {
    Good,
    GoodImages,
    Brand,
    Rating,
    Favourites,
} = require('../modules/models');
const ApiError = require('../error/ApiError');

class favouritesController {
    async postGoodInFavourites(req, res, next) {
        try {
            const {
                goodId
            } = req.body;
            const userId = req.user.id

            let goodInFavourites;
            const alreadyInFavorites = await Favourites.findOne({ where: { userId, goodId } })
            if (alreadyInFavorites) return res.json(alreadyInFavorites);
            else {
                goodInFavourites = await Favourites.create({ userId, goodId });
            }
            return res.json(goodInFavourites);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
    async getUserFavourites(req, res, next) {
        const userId = req.user.id
        if (!userId) {
            next(ApiError.badRequest("Не задан userId"));
        }
        let goodInFavourites;
        try {
            if (userId) {
                goodInFavourites = await Favourites.findAndCountAll({  
                    include: [{  
                      model: Good,  
                      include: [  
                        { 
                          model: Brand 
                        },  
                        { 
                          model: Rating 
                        },  
                        { 
                          model: GoodImages, 
                          order: [['id', 'ASC']]
                        },  
                      ],
                      order: [['id', 'ASC']]  
                    }],  
                    distinct: true,  
                    where: { userId },  
                    order: [['id', 'ASC']],  
                  })
            }
            else {
                goodInFavourites = await Favourites.findAndCountAll({
                    order: [['id', 'ASC']],
                    distinct: true,
                })
            }
            return res.json(goodInFavourites);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async isGoodInUserFavourites(req, res, next) {
        const { goodId } = req.query;
        const userId = req.user.id

        if (!userId || !goodId) {
            next(ApiError.badRequest("Не передан goodId"));
        }
        try {
            const goodInFavourites = await Favourites.findOne({ where: { userId, goodId } })
            if (!goodInFavourites) {
                return res.json(0);
            }
            return res.json(1);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteGoodInFavourites(req, res, next) {
        try {
            const { goodId } = req.body;
            const userId = req.user.id

            const goodInFavourites = await Favourites.destroy({
                where: {
                    goodId,
                    userId
                }
            });
            return res.json(goodInFavourites);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

}

module.exports = new favouritesController();