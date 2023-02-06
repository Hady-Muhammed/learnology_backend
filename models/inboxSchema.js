const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const inboxSchema = new Schema({
  to: {
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
});

const Inbox = mongoose.model("Inbox", inboxSchema, 'inboxes');

const validateInbox = (inbox) => {
  const schema = joi.object({
    to: joi.string().required(),
    subject: joi.string().required(),
    body: joi.string().required(),
    sentAt: joi.string(),
    read: joi.boolean(),
  });
  return schema.validate(inbox);
};

module.exports = {Inbox, validateInbox};

