const mongoose = require("mongoose");
const joi = require("joi");
const Schema = mongoose.Schema;


const quizSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  publishedAt: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
  }
});

const Quiz = mongoose.model("Quiz", quizSchema, 'quizzes');

const validateQuiz = (quiz) => {
  const schema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    author: joi.object({
      name: joi.string().required(),
      id: joi.string().required(),
    }).required(),
    publishedAt: joi.string().required(),
    category: joi.string(),
    difficulty: joi.string(),
    questions: joi.array().items({
        head: joi.string().required(),
        correctAnswer: joi.string().required(),
        answers: joi.array().items(joi.string()).required(),
        solving_time: joi.string().required(),
    })
  });
  return schema.validate(quiz);
};


module.exports = {Quiz, validateQuiz};

