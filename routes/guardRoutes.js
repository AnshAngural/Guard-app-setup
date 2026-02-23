const express = require('express');
const router = express.Router();
const { protect , adminOnly } = require('../middleware/protect');

router.get('/schedule', protect, (req, res) => {
    res.render('schedule');
});

router.get('/timecard', protect, (req, res) => {
    res.render('timecard');
});

router.get('/dayoff', protect, (req, res) => {
    res.render('dayoff');
});

router.get('/profile', protect, (req, res) => {
    res.render('profile');
});

module.exports = router;