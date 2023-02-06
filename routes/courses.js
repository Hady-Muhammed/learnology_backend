const express = require("express");
const router = express.Router();
const { Course } = require("../models/courseSchema");
const { Teacher } = require("../models/teacherSchema");

// publishCourse APIs
router.post("/publishCourse", async (req, res) => {
  try {
    const { coursee, email } = req.body;
    const course = new Course(coursee);
    await course.save();
    const teacher = await Teacher.findOne({ email });
    teacher.courses_teaching.push(course._id.toString());
    await teacher.save();
    return res.send({ message: "Course published successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteCourse API
router.post("/deleteCourse", async (req, res) => {
  try {
    const { id, email } = req.body;
    const course = await Course.findByIdAndDelete({ _id: id });
    let teacher = await Teacher.findOne({ email });
    let indexOfCourse = teacher.courses_teaching.indexOf(id);
    teacher.courses_teaching.splice(indexOfCourse, 1);
    await teacher.save();
    return res.send({ message: "Course deleted successfully!" });
  } catch (err) {
    return res.send({ err });
  }
});

// getAllCourses API
router.get("/getAllCourses", async (req, res) => {
  try {
    const courses = await Course.find();
    return res.send(courses);
  } catch (error) {
    return res.send({ error });
  }
});

// getPopularCourses API
router.get("/getPopularCourses", async (req, res) => {
  try {
    const courses = await Course.find({
      num_of_likes: { $gt: 150 },
    });
    return res.send(courses);
  } catch (error) {
    return res.send({ error });
  }
});

// getCoursesByIds API
router.post("/getCoursesByIds", async (req, res) => {
  try {
    const coursesIDs = req.body.courses;
    let courses = [];
    for (let i = 0; i < coursesIDs.length; i++) {
      const course = await Course.findOne({ _id: coursesIDs[i] });
      courses.push(course);
    }
    return res.send(courses);
  } catch (error) {
    return res.send({ error });
  }
});

// getCourse API
router.get("/getCourse/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findOne({ _id: id });
    return res.send(course);
  } catch (error) {
    return res.send({ error });
  }
});

// modifyCourse API
router.post("/modifyCourse", async (req, res) => {
  try {
    const { id, modifiedCourse } = req.body;
    const course = await Course.findByIdAndUpdate(
      { _id: id },
      { ...modifiedCourse }
    );
    return res.send({ message: "Course modified successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getInstructor API
router.get("/getInstructor/:id", async (req, res) => {
  try {
    const courseID = req.params.id;
    const teacher = await Teacher.findOne({
      courses_teaching: { $in: [courseID] },
    });
    return res.send(teacher);
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
