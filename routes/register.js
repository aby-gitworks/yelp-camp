const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userschema = require('../models/user.js');
const usercon = mongoose.createConnection('mongodb://127.0.0.1/authdemo');
const User = usercon.model('User', userschema);

router.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('campgrounds/register');
})
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    console.log(username, password);
    res.send("Registered");
});

module.exports = router;