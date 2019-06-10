const Nightlife = require('../models/nightlife');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.nightlifeCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    Nightlife.findById(req.params.id, (err, foundNightlife) => {
      if (err) {
        req.flash('error', 'Nightlife venue not found');
        res.redirect('back');
      } else {
        if (foundNightlife.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.commentCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', 'Permission Required.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You still need to log in.');
    res.redirect('back');
  }
};

middlewareObj.checkRatingExists = function(req, res, next){
	Nightlife.findById(req.params.id).populate("ratings").exec(function(err, nightlife){
		if(err){
			console.log(err);
		}
		for(var i = 0; i < nightlife.ratings.length; i++ ) {
			if(nightlife.ratings[i].author.id.equals(req.user._id)) {
				req.flash("success", "You already rated this!");
				return res.redirect('/nightlife/' + nightlife._id);
			}
		}
		next();
	})
}

middlewareObj.loggedStatus = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You still need to log in.');
  res.redirect('/login');
};

module.exports = middlewareObj;
