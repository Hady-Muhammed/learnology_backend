const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  belongsTo: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commentID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  repliedAt: {
    type: String,
    required: true,
  },
  reacts: {
    type: Number,
    required: true,
  },
  replyHasLikes: {
    type: Boolean,
    required: true
  },
  replyHasLoves: {
    type: Boolean,
    required: true
  },
  replyHasWows: {
    type: Boolean,
    required: true
  },
});

const Reply = mongoose.model("Reply", replySchema, "replies");

const validateReply = (reply) => {
  const schema = joi.object({
    postID: joi.string(),
    commentID: joi.string(),
    belongsTo: joi.string(),
    content: joi.string(),
    repliedAt: joi.string(),
    reacts: joi.number(),
    replyHasLikes: joi.boolean(),
    replyHasLoves: joi.boolean(),
    replyHasWows: joi.boolean(),
  });
  return schema.validate(reply);
};

module.exports = { Reply, validateReply };



