const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  belongsTo: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  about_what: {
    type: String,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sender: {
    type: Array,
    required: true,
  },
  happenedAt: {
    type: String,
    required: true
  },
});

const Notification = mongoose.model("Notification", notificationSchema, 'notifications');

const validateNotification = (notification) => {
  const schema = joi.object({
    belongsTo: joi.string().required(),
    sentBy: joi.string().required(),
    type: joi.string().required(),
    about_what: joi.string().required(),
    postID: joi.string().required(),
    sender: joi.string().required(),
    happenedAt: joi.string().required(),
  });
  return schema.validate(notification);
};

module.exports = {Notification, validateNotification};

