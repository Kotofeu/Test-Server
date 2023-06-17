const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const basketController = require('../controllers/basketController')
const favouritesController = require('../controllers/favouritesController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.post('/edit', authMiddleware, userController.edit)
router.post('/create-admin', checkRole('ADMIN'), userController.createAdmin)



router.post('/basket', authMiddleware, basketController.postGoogInBasket);
router.get('/basket',authMiddleware, basketController.getUserBasket);
router.delete('/basket', authMiddleware, basketController.deleteGoodInBasket);
router.get('/basket/find-good',authMiddleware, basketController.isGoodInUserBasket);


router.post('/favourite',authMiddleware, favouritesController.postGoodInFavourites);
router.get('/favourite',authMiddleware, favouritesController.getUserFavourites);
router.delete('/favourite',authMiddleware, favouritesController.deleteGoodInFavourites);
router.get('/favourite/find-good',authMiddleware, favouritesController.isGoodInUserFavourites);

router.get('/:id', userController.getById);

module.exports = router