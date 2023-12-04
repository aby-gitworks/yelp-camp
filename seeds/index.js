const express = require('express');
const app = express();
const path = require('path');
const cities = require('./cities.js')
const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const { places, descriptors } = require('./seedHelpers.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/reserve/wi9yf7kTQxCNeY72cCY6_Images%20of%20Jenny%20Lace%20Plasticity%20Publish%20%284%20of%2025%29.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY5OTQxODY4MQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
            description: 'Something something Loerm Impsum',
            price:0
        })
        await camp.save();
    }
    /*
    const c = new Campground({ title: 'purple field' });
    console.log("right before the save function");
    await c.save();
    */
}
seedDB();