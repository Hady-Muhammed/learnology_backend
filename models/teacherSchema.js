const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  picture: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  courses_teaching: {
    type: Array,
  },
  articles_published: {
    type: Array,
  },
  quizzes_published: {
    type: Array,
  },
  createdAt: {
    type: String
  },
  likes: {
    type: Number
  },
  online: {
    type: Boolean
  },
  last_activity: {
    type: String
  },
});

teacherSchema.methods.generateAuthToken = (email,password) => {  const token = jwt.sign({ email , password , role: "teacher"}, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
});
    return token;
};

const Teacher = mongoose.model("Teacher", teacherSchema, 'teachers');

const validateTeacher = (teacher) => {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required(),
    email: joi.string().min(5).max(200).required().email(),
    password: joi.string().min(5).max(1024).required(),
    picture: joi.string().required(),
    title: joi.string().min(5).max(50).required(),
    createdAt: joi.string().required(),
    likes: joi.number(),
    articles_published: joi.array().items(joi.string()),
    courses_teaching: joi.array().items(joi.string()),
    quizzes_published: joi.array().items(joi.string()),
    online: joi.boolean(),
    last_activity: joi.string().required(),
  });

  return schema.validate(teacher);
};

module.exports = {Teacher, validateTeacher};

