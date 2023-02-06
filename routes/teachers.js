const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateTeacher, Teacher } = require("../models/teacherSchema");
const { Chat } = require("../models/chatSchema");

// Registration API
router.post("/", async (req, res) => {
  try {
    // Validate req
    const { error } = validateTeacher(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if this user already exisits
    let teacherExists = await Teacher.findOne({ email: req.body.email });
    if (teacherExists)
      return res.status(409).send({ message: "That teacher already exists!" });
    else {
      // Insert the new user if they do not exist yet
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const teacher = new Teacher({ ...req.body, password: hashPassword });
      await teacher.save();
      res.status(201).send({ message: "Teacher created successfully" });
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
    let teacherExists = await Teacher.findOne({ email });
    if (!teacherExists)
      return res.status(404).send({ message: "Email not valid!" });
    else {
      const correctPassword = await bcrypt.compare(
        password,
        teacherExists?.password
      );
      if (!correctPassword)
        return res.status(404).send({ message: "Password not valid!" });
      const token = teacherExists.generateAuthToken(email, password);
      return res.status(201).send({ token, message: "Logged in successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// getAllTeachers API
router.get("/getAllTeachers", async (req, res) => {
  try {
    const allTeachers = await Teacher.find();
    return res.send(allTeachers);
  } catch (err) {
    return res.send({ err });
  }
});

// getTeacher API
router.get("/getTeacher/:email", async (req, res) => {
  try {
    const email = req.params.email;
    let teacher = await Teacher.findOne({ email });
    return res.send(teacher);
  } catch (error) {
    return res.send({ error });
  }
});

// getTeacherById API
router.get("/getTeacherById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let teacher = await Teacher.findById({ _id: id });
    return res.send(teacher);
  } catch (error) {
    return res.send({ error });
  }
});

// getTeacherByID API
router.get("/getTeacherByID/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let teacher = await Teacher.findById({ _id: id });
    return res.send(teacher);
  } catch (error) {
    return res.send({ error });
  }
});

// uploadPicture API
router.post("/uploadPicture", async (req, res) => {
  try {
    const { email, Img } = req.body;
    await Teacher.findOneAndUpdate({ email }, { picture: Img });
    return res.send({ message: "Picture uploaded successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// updateTeacher API
router.post("/updateTeacher", async (req, res) => {
  try {
    const { email, modifiedAccount, password } = req.body;
    if (!password) {
      await Teacher.findOneAndUpdate({ email }, { ...modifiedAccount });
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(password, salt);
      await Teacher.findOneAndUpdate(
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
    return res.send({ message: "Teacher updated successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteTeacher API
router.post("/deleteTeacher", async (req, res) => {
  try {
    const { email } = req.body;
    await Teacher.findOneAndDelete({ email });
    return res.send({ message: "Teacher deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteManyTeachers API
router.post("/deleteManyTeachers", async (req, res) => {
  try {
    const { emails } = req.body;
    await Teacher.deleteMany({ email: { $in: emails } });
    return res.send({ message: "Teachers deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getQuote API
router.get("/getQuote", (req, res) => {
  let quotes = [
    {
      author: "Socrates",
      content: "I cannot teach anybody anything; I can only make them think.",
    },
    {
      author: "Benjamin Franklin",
      content:
        "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    },
    {
      author: "Joseph Addison",
      content:
        "What sculpture is to a block of marble, education is to a human soul.",
    },
    {
      author: "William A. Ward",
      content:
        "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.",
    },
    {
      author: "Margaret Mead",
      content: "Children must be taught how to think, not what to think.",
    },
  ];
  return res.send(quotes[Math.round(Math.random() * quotes.length)]);
});
module.exports = router;
