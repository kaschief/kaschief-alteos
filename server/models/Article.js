const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'The title is required'],
      minlength: 1
    },
    contents: {
      type: String
    },
    _owner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
