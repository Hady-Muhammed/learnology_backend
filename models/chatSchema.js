const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    person1_ID: {
      type: mongoose.Types.ObjectId
    },
    person2_ID: {
      type: mongoose.Types.ObjectId
    },
    newMessages: Number,
    messages: [
      {
        belongsTo: String,
        content: String,
        sentAt: String,
      }
    ]
});

const Chat = mongoose.model("Chat", chatSchema, 'chats');

const validateChat = (chat) => {
  const schema = joi.object({
    person1_ID: joi.string().required(),
    person2_ID: joi.string().required(),
    newMessages: joi.number().required(),
    messages: joi.array().items({
        belongsTo: joi.string().required(),
        content: joi.string().required(),
        sentAt: joi.string().required(),
    }),
  });

  return schema.validate(chat);
};

module.exports = {Chat, validateChat};
