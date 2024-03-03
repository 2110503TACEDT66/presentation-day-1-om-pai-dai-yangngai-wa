const express = require('express');
const { getCoWorkings, getCoWorking, createCoWorking , updateCoWorking , deleteCoWorking } = require('../controllers/coWorkings');

const appointmentRouter = require('./appointments');

const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.use('/:coWorkingId/appointments/',appointmentRouter);

router.route('/').get(getCoWorkings).post(protect,authorize('admin'),createCoWorking);
router.route('/:id').get(getCoWorking).put(protect,authorize('admin'),updateCoWorking).delete(protect,authorize('admin'),deleteCoWorking);

module.exports = router