const mongoose = require('mongoose');

const nightlifeSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating"
    }
  ],
  rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Nightlife', nightlifeSchema);
