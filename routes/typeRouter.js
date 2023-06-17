const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('ADMIN'), typeController.post);
router.delete('/',checkRole('ADMIN'), typeController.delete);
router.get('/', typeController.getByCategory);
router.get('/:id', typeController.getById);
module.exports = router;