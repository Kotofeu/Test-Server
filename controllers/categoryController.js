const { Category, Type } = require('../modules/models');
const ApiError = require('../error/ApiError');

const staticManagement = require('../helpers/staticManagement')

class categoryController {
    async post(req, res, next) {
        try {
            let { id, name } = req.body;
            let image;
            let fileName
            if (req.files && req.files.image){
                image = req.files.image
                fileName = staticManagement.staticCreate(image)
            }
            let category;
            if (id) {
                staticManagement.staticDelete(await Category.findOne({ where: { id: id } }))
                category = await Category.update({ name, image: fileName }, { where: { id } });
            }
            else {
                category = await Category.create({ name, image: fileName });
            }
            return res.json(category);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res, next) {
        try {
            const category = await Category.findAndCountAll({
                order: [['name', 'ASC']],
                include: { model: Type },
                distinct: true
            })
            return res.json(category);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getById(req, res, next) {
        try {

            const { id } = req.params
            const category = await Category.findOne(
                {
                    where: { id }
                },
            )
            return res.json(category)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.body;
            staticManagement.staticDelete(await Category.findOne({ where: { id: id } }))
            const category = await Category.destroy({
                where: {
                    id: id
                }
            });
            return res.json(category);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new categoryController();