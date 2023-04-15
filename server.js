require("dotenv").config();
const express = require("express");
const { Student } = require("./models/studentSchema");
const { Teacher } = require("./models/teacherSchema");

const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const connection = require("./db");
const mongoose = require("mongoose");

// Routes
const studentsRoutes = require("./routes/students");
const teachersRoutes = require("./routes/teachers");
const articlesRoutes = require("./routes/articles");
const coursesRoutes = require("./routes/courses");
const chatsRoutes = require("./routes/chats");
const quizzesRoutes = require("./routes/quizzes");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const repliesRoutes = require("./routes/replies");
const reactsRoutes = require("./routes/reacts");
const notificationsRoutes = require("./routes/notifications");
const friendRequestsRoutes = require("./routes/friendsRequests");
const emailsRoutes = require("./routes/emails");
const inboxesRoutes = require("./routes/inboxes");
const sectionsRoutes = require("./routes/sections");

mongoose.set("strictQuery", true);

// connect to DB
connection();

// // middlewares
app.use(cors());
app.use(express.json());
app.use("/api/students", studentsRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/replies", repliesRoutes);
app.use("/api/reacts", reactsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/frequests", friendRequestsRoutes);
app.use("/api/emails", emailsRoutes);
app.use("/api/inboxes", inboxesRoutes);
app.use("/api/sections", sectionsRoutes);

const port = process.env.PORT || 1234;

// Real-time communications
io.on("connection", (socket) => {
  console.log(`user ${socket.handshake.query.studentEmail} connected`);

  socket.on("send-message", (message, chatID) => {
    socket.to(chatID).emit("receive-message", message);
  });

  socket.on("online", async (ID) => {
    let student = await Student.findById({ _id: ID });
    let teacher = await Teacher.findById({ _id: ID });
    if (student) {
      student.online = true;
      await student.save();
    }
    if (teacher) {
      teacher.online = true;
      await teacher.save();
    }
  });

  socket.on("typing-message", (chatID, message) => {
    if (message) socket.to(chatID).emit("listen-typing-message", true);
    else socket.to(chatID).emit("listen-typing-message", false);
  });

  socket.on("join-chat", (chatID) => {
    socket.join(chatID);
    console.log(`chat joined: ${chatID}`);
  });

  socket.on("add-comment", (email) => {
    io.emit("listen-someone-commented", email);
  });

  socket.on("add-reply", (email) => {
    io.emit("listen-someone-replied", email);
  });

  socket.on("add-react", (email) => {
    io.emit("listen-someone-reacted", email);
  });

  socket.on("disconnect", async () => {
    console.log(`user ${socket.handshake.query.studentEmail} disconnected`);
    let student = await Student.findOne({
      email: socket.handshake.query.studentEmail,
    });
    let teacher = await Teacher.findOne({
      email: socket.handshake.query.studentEmail,
    });
    if (student) {
      student.online = false;
      student.last_activity = new Date().toUTCString();
      await student.save();
    }
    if (teacher) {
      teacher.online = false;
      teacher.last_activity = new Date().toUTCString();
      await teacher.save();
    }
  });
});

http.listen(port, () => {
  console.log("Running on port 1234");
});
