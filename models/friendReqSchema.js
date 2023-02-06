const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const friendReqSchema = new Schema({
  to: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  from: {
    type: mongoose.Types.ObjectId,
  },
  read: {
    type: Boolean,
    required: true,
  },
});

const FriendReq = mongoose.model("FriendReq", friendReqSchema, 'friendrequests');

const validateRequest = (req) => {
  const schema = joi.object({
    to: joi.string().required(),
    from: joi.string().required(),
    read: joi.boolean().required(),
  });
  return schema.validate(req);
};

module.exports = {FriendReq, validateRequest};

