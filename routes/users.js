const express = require("express")
const router = express.Router()
const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const { storeReturnTo, validateUser } = require("../middleware")

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", validateUser, catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ username, email })
        const registerreduser = await User.register(user, password)
        req.login(registerreduser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to JustCamp!")
            res.redirect("/campgrounds")
        })

    } catch (err) {
        req.flash("error", "User or Email already exists")
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), catchAsync(async (req, res, next) => {
    req.flash("success", "Logged in successfully!!")
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}))

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});

module.exports = router
