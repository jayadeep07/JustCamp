const express = require("express")
const Campground = require("../models/campground")
const ExpressError = require("../utils/ExpressError")
const catchAsync = require("../utils/catchAsync")
const { campschema } = require("../models/checkcamp")
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware")

const router = express.Router()

// router.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: "backyard", price: "2930" })
//     await camp.save()
//     res.send(camp)
// })

//gets all the campgrounds
router.get("/", catchAsync(async (req, res, next) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))

//form for the new camp
router.get("/new", isLoggedIn, async (req, res) => {
    // if (!req.isAuthenticated()) {
    //     req.flash("error", "You must be logged in")
    //     return res.redirect('/login')
    // }
    res.render("campgrounds/new")
})

// function check(camp) {
//     for (let i in camp) {
//         if (camp[i].length === 0) return true
//     }
//     return false
// }

//to create a new camp
router.post('/', isLoggedIn, validateCamp, catchAsync(async (req, res, next) => {
    // if (check(req.body.camp)) {
    //     throw new ExpressError('Invalid Campground Data', 400);
    // }
    const camp = new Campground(req.body.camp)
    camp.author = req.user._id
    await camp.save()
    req.flash("success", "successfully added a new component")
    res.redirect(`/campgrounds/${camp._id}`)
}));

//show the camp in separate page
router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { camp });
}));

//to generate edit form 
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render("campgrounds/edit", { camp })
}))


//update the camp
router.put("/:id", isLoggedIn, isAuthor, validateCamp, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.camp })
    req.flash("success", "successfully updated the component")
    res.redirect(`/campgrounds/${camp.id}`)
}))

router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "successfully deleted the component")
    res.redirect('/campgrounds')
})

module.exports = router
