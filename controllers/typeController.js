
const { Type } = require('../modules/models');
const ApiError = require('../error/ApiError');
class typeController {
    async post(req, res, next) {
        try {
            let { id, name, categoryId } = req.body;
            let type;
            if (id) {
                type = await Type.update(
                    {
                        name: name,
                        categoryId: +categoryId
                    },
                    {
                        where: {
                            id: id
                        }
                    }
                );
            }
            else {
                type = await Type.create({ name: name, categoryId: +categoryId });
            }
            return res.json(type);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getByCategory(req, res, next) {
        try {
            let { categoryId } = req.query;
            const where = categoryId? {categoryId: categoryId}: null
            const type = await Type.findAndCountAll({

                where: where,
                order: [['name', 'ASC']],
                distinct:true

            })
            return res.json(type)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params
            const type = await Type.findOne(
                {
                    where: { id }
                },
            )
            return res.json(type)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.body;
            const type = await Type.destroy({
                where: {
                    id: id
                }
            });
            return res.json(type);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new typeController();