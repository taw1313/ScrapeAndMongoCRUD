let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: false
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'note'
  }]
});

let Article = mongoose.model('article', ArticleSchema);

module.exports = Article;