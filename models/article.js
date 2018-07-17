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
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'note'
  }
});

let Article = mongoose.model('article', ArticleSchema);

module.exports = Article;