const express = require("express");
const router  = express.Router();
const Nightlife = require("../models/nightlife");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Nightlife.find({}, (err, allNightlife) => {
        if(err){
            console.log(err);
        } else {
            res.render("nightlife/index",{nightlife:allNightlife});
        }
    });
});

router.post("/", middleware.loggedStatus, (req, res) =>{
    let name = req.body.name;
    let image = req.body.image;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newNightlife = {name: name, image: image, address: address, city: city, state: state, zip: zip, description: description, author:author};
    Nightlife.create(newNightlife, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/nightlife");
        }
    });
});


router.get("/new", middleware.loggedStatus, (req, res) => {
    res.render("nightlife/new");
});

router.get("/:id", (req, res) => {
    Nightlife.findById(req.params.id).populate("comments").populate("ratings").exec((err, foundNightlife) =>{
        if(err){
            console.log(err);
        } else {
            if(foundNightlife.ratings.length > 0) {
                var ratings = [];
                var length = foundNightlife.ratings.length;
                foundNightlife.ratings.forEach(function(rating) {
                    ratings.push(rating.rating)
                });
                var rating = ratings.reduce(function(total, element) {
                    return total + element;
                });
                foundNightlife.rating = rating / length;
                foundNightlife.save();
            }
            console.log("Ratings:", foundNightlife.ratings);
            console.log("Rating:", foundNightlife.rating);
            console.log(foundNightlife);
            res.render("nightlife/show", {nightlife: foundNightlife});
        }
    });
});


router.get("/:id/edit", middleware.nightlifeCheck, (req, res) =>{
    Nightlife.findById(req.params.id, (err, foundNightlife) => {
        res.render("nightlife/edit", {nightlife: foundNightlife});
    });
});

router.put("/:id",middleware.nightlifeCheck, (req, res) => {
    Nightlife.findByIdAndUpdate(req.params.id, req.body.nightlife, (err, updatedNightlife) => {
        if(err){
            res.redirect("/nighlife");
        } else {
            res.redirect("/nightlife/" + req.params.id);
        }
    });
});

router.delete("/:id",middleware.nightlifeCheck, (req, res) => {
    Nightlife.findByIdAndRemove(req.params.id, (err) => {
        res.redirect("/nightlife");
    });
});

module.exports = router;