const express = require('express');
const { getCoWorkings, getCoWorking, createCoWorking , updateCoWorking , deleteCoWorking } = require('../controllers/coWorking');

const router = express.Router();

router.route('/').get(getCoWorkings).post(createCoWorking);
router.route('/:id').get(getCoWorking).put(updateCoWorking).delete(deleteCoWorking);

module.exports = router