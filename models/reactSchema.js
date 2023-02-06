const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const reactSchema = new Schema({
  belongsTo: { // 'post' | 'comment'
    type: String,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentIDIfAvailable: {
    type: String,
  },
});

const React = mongoose.model("React", reactSchema, "reacts");

const validateReact = (react) => {
  const schema = joi.object({
    belongsTo: joi.string(),
    postID: joi.string(),
    type: joi.string(),
    owner: joi.string(),
    commentIDIfAvailable: joi.string()
  });
  return schema.validate(react);
};

module.exports = { React, validateReact };
