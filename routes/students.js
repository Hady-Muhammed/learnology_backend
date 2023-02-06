const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateStudent, Student } = require("../models/studentSchema");
const { Course } = require("../models/courseSchema");
const { Teacher } = require("../models/teacherSchema");
const { Chat } = require("../models/chatSchema");

// Registration API
router.post("/", async (req, res) => {
  try {
    // Validate req
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if this user already exisits
    let studentExists = await Student.findOne({ email: req.body.email });
    if (studentExists)
      return res.status(409).send({ message: "That student already exists!" });
    else {
      // Insert the new user if they do not exist yet
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const student = new Student({ ...req.body, password: hashPassword });
      await student.save();
      res.status(201).send({ message: "Student created successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if this user already exisits
    let studentExists = await Student.findOne({ email });
    if (!studentExists)
      return res.status(404).send({ message: "Email not valid!" });
    else {
      const correctPassword = await bcrypt.compare(
        password,
        studentExists?.password
      );
      if (!correctPassword)
        return res.status(404).send({ message: "Password not valid!" });
      const token = studentExists.generateAuthToken(email, password);
      return res.status(201).send({ token, message: "Logged in successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// getStudent API
router.get("/getStudent/:email", async (req, res) => {
  try {
    const email = req.params.email;
    let student = await Student.findOne({ email });
    return res.send(student);
  } catch (error) {
    return res.send({ error });
  }
});

// getStudentByID API
router.get("/getStudentByID/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let student = await Student.findById({ _id: id });
    return res.send(student);
  } catch (error) {
    return res.send({ error });
  }
});

// getStudentsByIds API
router.post("/getStudentsByIds", async (req, res) => {
  try {
    const studentIDs = req.body.students;
    let students = [];
    for (let i = 0; i < studentIDs.length; i++) {
      const student = await Student.findOne({ _id: studentIDs[i] });
      students.push(student);
    }
    return res.send(students);
  } catch (error) {
    return res.send({ error });
  }
});

// getAllStudents API
router.get("/getAllStudents", async (req, res) => {
  try {
    const students = await Student.find();
    return res.send(students);
  } catch (error) {
    return res.send({ error });
  }
});

// getOnlineUsers API
router.get("/getOnlineUsers/:emails", async (req, res) => {
  try {
    const emails = req.params.emails.split(",");
    const students = await Student.find({
      email: { $in: emails },
      online: true,
    });
    const teachers = await Teacher.find({
      email: { $in: emails },
      online: true,
    });
    return res.send([...students, ...teachers]);
  } catch (error) {
    return res.send({ error });
  }
});

// likeTeacher API
router.post("/likeTeacher", async (req, res) => {
  try {
    const { email, teacherID } = req.body;
    let student = await Student.findOne({ email });
    student.liked_teachers.push(teacherID);
    await student.save();
    let teacher = await Teacher.findById({ _id: teacherID });
    teacher.likes++;
    await teacher.save();
    return res.send({ message: "Teacher liked successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getFriends API
router.get("/getFriends/:studentEmail", async (req, res) => {
  try {
    let studentEmail = req.params.studentEmail;
    let student = await Student.findOne({ email: studentEmail });
    let friends = [];
    for (const frnd of student.friends) {
      let std = await Student.findById({ _id: frnd });
      friends.push(std);
    }
    return res.send(friends);
  } catch (error) {
    return res.send({ error });
  }
});

// removeFriend API
router.post("/removeFriend", async (req, res) => {
  try {
    let { person1, person2 } = req.body;
    let student1 = await Student.findById({ _id: person1._id });
    let student2 = await Student.findById({ _id: person2._id });
    let i = student1.friends.findIndex((x) => x === person2._id);
    let j = student2.friends.findIndex((x) => x === person1._id);
    student1.friends.splice(i, 1);
    student2.friends.splice(j, 1);
    await student1.save();
    await student2.save();
    return res.send({ message: "Friend removed successfully!" });
  } catch (error) {
    return res.send(error);
  }
});

// enrollCourse API
router.post("/enrollCourse", async (req, res) => {
  try {
    const { email, course } = req.body;
    const student = await Student.findOne({ email });
    const coursee = await Course.findById({ _id: course._id });
    student.enrolled_courses.push(course._id);
    coursee.enrolled_students.push(student._id);
    await student.save();
    await coursee.save();
    return res.send({ message: "Course enrolled successfully!" });
  } catch (err) {
    return res.send({ err });
  }
});

// takeQuiz API
router.post("/takeQuiz", async (req, res) => {
  try {
    const { email, quizID } = req.body;
    let student = await Student.findOne({ email });
    student.taken_quizzes.push({
      id: quizID,
      score: "",
      takenAt: new Date().toUTCString(),
    });
    await student.save();
    return res.send({ message: "Quiz taken successfully!" });
  } catch (err) {
    return res.send({ err });
  }
});

// deleteStudent API
router.post("/deleteStudent", async (req, res) => {
  try {
    const { email } = req.body;
    await Student.findOneAndDelete({ email });
    return res.send({ message: "Student deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteManyStudents API
router.post("/deleteManyStudents", async (req, res) => {
  try {
    const { emails } = req.body;
    await Student.deleteMany({ email: { $in: emails } });
    return res.send({ message: "Students deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// updateStudent API
router.post("/updateStudent", async (req, res) => {
  try {
    const { email, modifiedAccount, password } = req.body;
    if (!password) {
      await Student.findOneAndUpdate({ email }, { ...modifiedAccount });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(password, salt);
      await Student.findOneAndUpdate(
        { email },
        { ...modifiedAccount, password: hashPassword }
      );
    }
    let chats1 = await Chat.find({ "person1.email": email });
    let chats2 = await Chat.find({ "person2.email": email });
    for (let i = 0; i < chats1.length; i++) {
      chats1[i].person1.name = modifiedAccount.name;
      await chats1[i].save();
    }
    for (let i = 0; i < chats2.length; i++) {
      chats2[i].person2.name = modifiedAccount.name;
      await chats2[i].save();
    }
    return res.send({ message: "Student updated successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// uploadPicture API
router.post("/uploadPicture", async (req, res) => {
  try {
    const { email, Img } = req.body;
    await Student.findOneAndUpdate({ email }, { picture: Img });
    return res.send({ message: "Picture uploaded successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getActiveStudents
router.get("/getActiveStudents", async (req, res) => {
  try {
    const students = await Student.find({ online: true });
    return res.send(students);
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
