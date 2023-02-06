const express = require("express");
const router = express.Router();
const { Quiz } = require("../models/quizSchema");
const { Student } = require("../models/studentSchema");

// createQuiz API
router.post("/createQuiz", async (req, res) => {
  try {
    const { quizz } = req.body;
    const quiz = new Quiz(quizz);
    await quiz.save();
    return res.send({ message: "Quiz created successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllQuizzes API
router.get("/getAllQuizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    return res.send(quizzes);
  } catch (error) {
    return res.send({ error });
  }
});

// getTeacherQuizzes API
router.get("/getTeacherQuizzes/:id", async (req, res) => {
  try {
    const teacherID = req.params.id;
    const quizzes = await Quiz.find({ "author.id": teacherID });
    return res.send(quizzes);
  } catch (error) {
    return res.send({ error });
  }
});

// getSingleQuiz API
router.get("/getSingleQuiz/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const quiz = await Quiz.findById({ _id: id });
    return res.send(quiz);
  } catch (error) {
    return res.send({ error });
  }
});

// deleteQuiz API
router.post("/deleteQuiz", async (req, res) => {
  try {
    const { id } = req.body;
    await Quiz.findByIdAndDelete({ _id: id });
    return res.send({ message: "Quiz deleted succesfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// updateQuiz API
router.post("/updateQuiz", async (req, res) => {
  try {
    const { id, modifiedQuiz, questionss } = req.body;
    await Quiz.findByIdAndUpdate(
      { _id: id },
      { ...modifiedQuiz, questions: [...questionss] }
    );
    return res.send({ message: "Quiz updated succesfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// calculateScore API
router.post("/calculateScore", async (req, res) => {
  try {
    const { studentEmail, quizID, score } = req.body;
    let student = await Student.updateOne(
      { email: studentEmail, taken_quizzes: { $elemMatch: { id: quizID } } },
      {
        $set: {
          "taken_quizzes.$.score": score,
        },
      }
    );
    return res.send({ message: student });
  } catch (error) {
    return res.send({ error });
  }
});

// getQuizzesByIds API
router.post("/getQuizzesByIds", async (req, res) => {
  try {
    const quizIDs = req.body.quizIDs;
    let quizzes = [];
    for (let i = 0; i < quizIDs.length; i++) {
      const quiz = await Quiz.findOne({ _id: quizIDs[i] });
      quizzes.push(quiz);
    }
    return res.send(quizzes);
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
