const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
    unique: true,
  },
  picture: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  createdAt: {
    type: String,
    required: true,
  },
  enrolled_courses: {
    type: Array
  },
  liked_teachers: {
    type: Array
  },
  taken_quizzes: {
    type: Array
  },
  reacts: {
    type: Array
  },
  online: {
    type: Boolean
  },
  last_activity: {
    type: String
  },
  friends: {
    type: Array
  },
});

studentSchema.methods.generateAuthToken = (email,password) => {
  const token = jwt.sign({ email , password }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const Student = mongoose.model("Student", studentSchema, 'students');

const validateStudent = (student) => {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required(),
    email: joi.string().min(5).max(200).required().email(),
    picture: joi.string().required(),
    password: joi.string().min(5).max(1024).required(),
    createdAt: joi.string().required(),
    enrolled_courses: joi.array(),
    liked_teachers: joi.array().items(joi.string()),
    taken_quizzes: joi.array().items({
      id: joi.string().required(),
      score: joi.string().required(),
      takenAt: joi.string().required()
    }),
    reacts: joi.array().items({
      belongsTo: joi.string(),
      postID: joi.string(),
      type: joi.string(),
    }),
    last_activity: joi.string().required(),
    online: joi.boolean(),
    friends: joi.array().items(joi.string())
  });

  return schema.validate(student);
};

module.exports = {Student, validateStudent};

