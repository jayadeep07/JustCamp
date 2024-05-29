const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
require("dotenv").config()


const campgroundsRoutes = require("./routes/campgrounds")
const reviewsRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")



mongoose.connect(`mongodb+srv://jayadeep:jayadeep@cluster0.t3e9vja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log(`MongoDB Connected on MongoDB Cluster`)
    })
    .catch((err) => {
        console.log(`MongoDB Not Connected Problem: ${err}`)
    });



const app = express()



app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")
app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

const sessionconfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionconfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})


app.use("/", userRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id", reviewsRoutes)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        req.flash('error', 'Invalid Campground ID.');
        return res.redirect('/campgrounds');
    }
    if (!err.message) err.message = "Something went wrong!!"
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("server started http://localhost:3000");
})