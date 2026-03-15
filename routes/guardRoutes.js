const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/protect');
const guardController = require('../controllers/guardController');

router.get('/schedule', protect, guardController.getSchedule);

router.get('/timecard',  protect, guardController.getTimecard);
router.post('/clockin',  protect, guardController.clockIn);
router.post('/clockout', protect, guardController.clockOut);

router.get('/dayoff',  protect, guardController.getDayOff);
router.post('/dayoff', protect, guardController.submitDayOff);

router.get('/profile', protect, (req, res) => res.render('profile'));

module.exports = router;