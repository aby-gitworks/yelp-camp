const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const cors = require('cors');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./apperror.js');
const Review = require('./models/review.js');
const registerRoute = require('./routes/register.js');
const loginRoute = require('./routes/login.js');
const session = require('express-session');
const passport = require('passport');
const localstrategy = require('passport-local');
const puser = require('./models/passuser.js');


app.use(session({ secret: 'thisisnotagoodsecret' }));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(puser.authenticate()));
passport.serializeUser(puser.serializeUser());
passport.deserializeUser(puser.deserializeUser());

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

const verifyPass = (req, res, next) => {
    console.log("Indside the called middleware function");
    console.log(req.session.user);
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}
app.get('/fakeuser', async (req, res) => {
    const user = new puser({ email: 'glom', username: 'Abylom' });
    const newuser = await puser.register(user, 'chicken');
    res.send(newuser);
})
app.get('/', (req, res) => {
    //res.render('home');
    throw new AppError('Go To the other pages', 404);
});
app.get('/campgrounds', verifyPass, async (req, res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping!' });
    await camp.save();
    res.send(camp);
})
app.get('/campgrounds/new', verifyPass, (req, res) => {
    res.render('campgrounds/new');
})
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground});
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})
app.post('/campgrounds', verifyPass, async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds');
})
app.put('/campgrounds/:id/edit', async (req, res) => {
    /*const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });*/
    const id = req.params.id;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const campground = await Campground.findById(id);
    //res.redirect('/campgrounds/${campground._id}');
    res.render('campgrounds/show', { campground });
})
/*app.delete('/campgrounds/:id/delete', async (req, res) => {
    /*const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
    const id = req.params.id;
    const campgroundname = req.body.campground.title;
    console.log("inside the delete call");
    console.log(campgroundname);
    /*await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const campground = await Campground.findById(id);
    //res.redirect('/campgrounds/${campground._id}');
    res.render('campgrounds/show', { campground });
})*/
app.post('/campgrounds/:id/reviews', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
app.delete('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.get('/logout', (req, res) => {
    console.log("this is the present id" + req.session.id);
    req.session.destroy();
    //console.log(req.session.id);
    res.send("logged out");
})
app.listen(3000, () => {
    console.log('serving on port 3000');
})
app.get('/login', (req, res) => {
    res.render('campgrounds/login');
})