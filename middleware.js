const ExpressError = require("./utils/ExpressError")
const { campschema, reviewschema } = require("./models/checkcamp")
const Campground = require("./models/campground")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be logged in!!")
        return res.redirect("/login")
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campg = await Campground.findById(id)
    if (!campg) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    if (!campg.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)

    if (!review) {
        req.flash('error', 'Cannot find that Review!');
        return res.redirect('/campgrounds');
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campschema.validate(req.body)
    if (error) {
        req.flash("error", "Invalid type of data")
        res.redirect(`${req.originalUrl}`)
        // const msg = error.details.map(el => el.message).join(",")
        // console.log(req.originalUrl)
        // throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewschema.validate(req.body)
    if (error) {
        req.flash("error", "Invalid review")
        res.redirect(`/campgrounds/${req.params.id}`)
        // const msg = error.details.map(el => el.message).join(",")
        // throw new ExpressError(msg, 400)
    } else {
        next()
    }
}