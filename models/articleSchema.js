const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  image: {
    type: String,
    required: true,
  },
  postedAt: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
});

const Article = mongoose.model("Article", articleSchema, 'articles');

const validateArticle = (article) => {
  const schema = joi.object({
    author: joi.string().required().max(20).min(5),
    title: joi.string().required().max(50).min(5),
    image: joi.string().required(),
    postedAt: joi.string().required(),
    category: joi.string().max(200).min(5),
    body: joi.string().max(5000).min(5),
  });
  return schema.validate(article);
};

module.exports = {Article, validateArticle};

