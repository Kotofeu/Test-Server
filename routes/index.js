const Router = require('express');
const router = new Router();
const goodRouter = require('./goodRouter');
const offerRouter = require('./offerRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const typeRouter = require('./typeRouter');
const ratingRouter = require('./ratingRouter');
const userRouter = require('./userRouter');



router.use('/good', goodRouter);
router.use('/offer', offerRouter);
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/type', typeRouter);
router.use('/rating', ratingRouter);
router.use('/user', userRouter);

module.exports = router;