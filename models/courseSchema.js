const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  instructor_name: {
    type: String,
    required: true,
  },
  instructor_title: {
    type: String,
    required: true,
  },
  course_title: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String,
    required: true,
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
  },
  overview: {
    type: String,
    required: true,
  },
  num_of_likes: {
    type: Number,
  },
  videos: {
    type: Array,
    required: true,
  },
  rating: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  enrolled_students: {
    type: Array,
    required: true
  },
  WhatYouWillLearn: [String]
});

const Course = mongoose.model("Course", courseSchema, 'courses');

const validateCourse = (course) => {
  const schema = joi.object({
    instructor_name: joi.string().required(),
    instructor_title: joi.string().required(),
    course_title: joi.string().required(),
    short_desc: joi.string().required(),
    image: joi.string().required(),
    postedAt: joi.string().required(),
    category: joi.string().required(),
    overview: joi.string().required(),
    num_of_likes: joi.number(),
    videos: joi.array(),
    rating: joi.array().required(),
    price: joi.number().required(),
    enrolled_students: joi.array().items(joi.string()).required(),
    WhatYouWillLearn: joi.array().items(joi.string()).required(),
  });
  return schema.validate(course);
};

module.exports = {Course, validateCourse};

