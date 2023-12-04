const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const userschema = require('../models/user.js');
const usercon = mongoose.createConnection('mongodb://127.0.0.1/authdemo');
const User = usercon.model('User', userschema);


route.get('/', (req, res) => {
    res.render('campgrounds/login');
})
route.post('/', async (req, res) => {
    //const { username, password } = req.body;
    const user = new User(req.body);
    //console.log(username, password);
    const exists = await User.findAndValidate(user.username,user.password);
    console.log(exists);
    if (exists) {
        req.session.user = exists.username;
        console.log(req.session.user);
        return res.send("Cool!");
    }
    res.send("nope");
})

module.exports = route;