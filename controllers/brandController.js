const { Brand } = require('../modules/models');
const ApiError = require('../error/ApiError');
const staticManagement = require('../helpers/staticManagement')

class brandController {
    async post(req, res, next) {
        try {
            let { id, name } = req.body;
            let image;
            let fileName
            if (req.files && req.files.image){
                image = req.files.image
                fileName = staticManagement.staticCreate(image)
            }
            let brand;
            if (id) {
                staticManagement.staticDelete(await Brand.findOne({ where: { id: id } }))
                brand = await Brand.update({name,image: fileName},{where: {id: id}});
            }
            else {
                brand = await Brand.create({ name: name, image: fileName });
            }
            return res.json(brand);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res, next) {
        try {
            const brand = await Brand.findAndCountAll()
            return res.json(brand);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getById(req, res, next) {
        try {

            const { id } = req.params
            const brand = await Brand.findOne(
                {
                    where: { id }
                },
            )
            return res.json(brand)
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            let { id } = req.body;
            staticManagement.staticDelete(await Brand.findOne({ where: { id: id } }))
            const brand = await Brand.destroy({
                where: {
                    id: id
                }
            });
            return res.json(brand);
        }
        catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new brandController();