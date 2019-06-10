const express = require('express');
const router = express.Router({ mergeParams: true });
const Nightlife = require('../models/nightlife');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.get('/new', middleware.loggedStatus, (req, res) => {
  console.log(req.params.id);
  Nightlife.findById(req.params.id, (err, nightlife) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { nightlife: nightlife });
    }
  });
});

router.post('/', middleware.loggedStatus, (req, res) => {
  Nightlife.findById(req.params.id, (err, nightlife) => {
    if (err) {
      console.log(err);
      res.redirect('/nightlife');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          nightlife.comments.push(comment);
          nightlife.save();
          console.log(comment);
          req.flash('success', 'You added a comment');
          res.redirect('/nightlife/' + nightlife._id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middleware.commentCheck, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        lostPet_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

router.put('/:comment_id', middleware.commentCheck, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/nightlife/' + req.params.id);
      }
    }
  );
});

router.delete('/:comment_id', middleware.commentCheck, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/nightlife/' + req.params.id);
    }
  });
});

module.exports = router;
