const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
  belongsTo: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  sentAt: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
  replied: {
    type: Boolean,
    required: true,
  },
});

const Email = mongoose.model("Email", emailSchema, 'emails');

const validateEmail = (email) => {
  const schema = joi.object({
    belongsTo: joi.string(),
    subject: joi.string().required(),
    body: joi.string().required(),
    sentAt: joi.string(),
    read: joi.boolean(),
    replied: joi.boolean(),
  });
  return schema.validate(email);
};

module.exports = {Email, validateEmail};

