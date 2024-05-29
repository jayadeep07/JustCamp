const express = require("express")
const Campground = require("../models/campground")
const Review = require("../models/review")
const catchAsync = require("../utils/catchAsync")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")


const router = express.Router({ mergeParams: true })

router.post("/reviews", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash("success", "Created new review")
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete("/delete/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash("success", "Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router

