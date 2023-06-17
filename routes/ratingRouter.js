const Router = require('express');
const router = new Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, ratingController.postRating);
router.delete('/', authMiddleware, ratingController.deleteRating);
router.get('/good', ratingController.getAllRatingByGood);
router.get('/user', ratingController.getAllRatingByUser);

module.exports = router;