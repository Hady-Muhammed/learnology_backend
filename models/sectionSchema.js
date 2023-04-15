const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  title: {
    type: String
  },
  courseID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  videos: [
    {
      order: {
        type: Number
      },
      title: {
        type: String
      },
      video_url: {
        type: String
      }
    }
  ]
});

const Section = mongoose.model("Section", sectionSchema, 'sections');

const validateSection = (section) => {
  const schema = joi.object({
    title: joi.string().required(),
    courseID: joi.string().required(),
    videos: joi.array().required(),
  });
  return schema.validate(section);
};

module.exports = {Section, validateSection};

