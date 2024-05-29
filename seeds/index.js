const cities = require("./cities")
const path = require("path")
const places = require("./seedhelpers")
const mongoose = require("mongoose")
const Campground = require("../models/campground")

mongoose.connect(`mongodb+srv://jayadeep:jayadeep@cluster0.t3e9vja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    , {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).then(() => {
    console.log(`MongoDB Connected on MongoDB Cluster`)
}).catch((err) => {
    console.log(`MongoDB Not Connected Problem: ${err}`)
});

const seeddb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 15; i++) {
        let data = cities[i]
        const camp = new Campground({
            author: "6656bcef52d54d692814d3cd",
            location: `${data.city}, ${data.state}`,
            title: `${places[i].place} ${places[i].descriptor}`,
            image: "https://cdn.vox-cdn.com/thumbor/FMUIaXcnBaKK9YqdP8qtxUog150=/0x0:4741x3161/1200x800/filters:focal(1992x1202:2750x1960)/cdn.vox-cdn.com/uploads/chorus_image/image/59535149/shutterstock_625918454.0.jpg",
            price: Math.floor(Math.random() * 9000) + 1000,
            description: "kajlsdfh asd flkasjdflka df; asdf asjdl hflsk dlaksjdhf lkjasd fajkdfs adlfka sldf jaskdjalskd jfasdkjflak dfaslk"
        })
        await camp.save()
    }

}
seeddb()