let express = require("express");
let router  = express.Router({mergeParams: true});
let Nightlife = require("../models/nightlife");
let Rating = require("../models/rating");
let middleware = require("../middleware");

router.post('/', middleware.loggedStatus, middleware.checkRatingExists, function(req, res) {
	Nightlife.findById(req.params.id, function(err, nightlife) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
			Rating.create(req.body.rating, function(err, rating) {
				if(err) {
					console.log(err);
				}
				rating.author.id = req.user._id;
				rating.author.username = req.user.username;
				rating.save();
				nightlife.ratings.push(rating);
				nightlife.save();
				req.flash("success", "Successfully added rating");
			});
		} else {
			req.flash("error", "Please select a rating");
		}
		res.redirect('/nightlife/' + nightlife._id);
	});
});

module.exports = router;