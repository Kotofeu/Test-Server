const Router = require('express');
const router = new Router();
const goodController = require('../controllers/goodController');
const checkRole = require('../middleware/checkRoleMiddleware')

/**
 * Возвращает всю информацию о товарах / товаре
 * Переменные приходящие в req.query
 * @param {number} goodId id товара
*/
router.get('/info', goodController.getAllGoodInfo);


/**
 * Удаляет строку информации о товаре
 * Переменные приходящие в req.body
 * @param {number} id id строки информации
*/
router.delete('/info',checkRole('ADMIN'), goodController.deleteGoodInfo);


/**
 * Возвращает все изображения товаров / товара
 * Переменные приходящие в req.query
 * @param {number} goodId id товара
*/
router.get('/image', goodController.getAllGoodImage);


/**
 * Удаляет изображение товара 
 * Переменные приходящие в req.body
 * @param {number} id id изображения
*/
router.delete('/image',checkRole('ADMIN'), goodController.deleteGoodImage);


/**
 * Возвращает изображение товара
 * Переменные приходящие в req.params
 * @param {number} id id изображения
*/
router.get('/image/:id', goodController.getGoodImageById);


/**
 * Создаёт и обновляет товар
 * Переменные приходящие в req.body
 * @param {number} id id товара, при указании производит обновление товара, при отсутствии добавление
 * @param {string} name название товара
 * @param {number} price цена товара
 * @param {number} oldPrice старая цена товара, нужна для определения скидок
 * @param {boolean} isPromotion нахождение товара на вкладке Акции
 * @param {number} categoryId id категории
 * @param {number} typeId id типа товара
 * @param {number} brandId id бренда
 * @param {info[]} info массив информации об объекте
 * {
    * @var {string} name название зарактеристики, 
    * @var {string} description описание характеристики, 
 * }
 * 
 * Переменные приходящие в req.files
 * @param {image[]} images картинки товара
*/
router.post('/',checkRole('ADMIN'), goodController.postGood);


/**
 * Поиск товаров по параметрам 
 * Переменные приходящие в req.query
 * @param {number} categoryId id категории товара
 * @param {number} typeId id типа товара
 * @param {number} brandId id типа товара
 * @param {string} name название товара
 * @param {number} minPrice минимальная цена для товара
 * @param {number} maxPrice максимальная цена для товара
 * @param {string} orderBy упорядочить по @enum {name, price, id: default}
 * @param {boolean} isPromotion является ли товар в разделе акции
 * @param {number} limit лимит количества получаемых товаров
 * @param {number} page страница получаемых товаров
*/
router.get('/', goodController.getAllGoods);


/**
 * Удаляет товар 
 * Переменные приходящие в req.body
 * @param {number} id id товара
*/
router.delete('/',checkRole('ADMIN'), goodController.deleteGood);


/**
 * Возвращает товар
 * Переменные приходящие в req.params
 * @param {number} id id товара
*/
router.get('/:id', goodController.getGoodById);


module.exports = router;