const Router = require('express');
const router = new Router();
const offerController = require('../controllers/offerController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('ADMIN'), offerController.postOffer);
router.delete('/',checkRole('ADMIN'), offerController.deleteOffer);
router.delete('/good',checkRole('ADMIN'), offerController.deleteGoodAtOffer);
router.get('/', offerController.getAll);
router.get('/:id', offerController.getById);
module.exports = router;