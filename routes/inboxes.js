const express = require("express");
const router = express.Router();
const { Inbox } = require("../models/inboxSchema");
const { Student } = require("../models/studentSchema");
const { Teacher } = require("../models/teacherSchema");
const { ObjectId } = require("mongodb");

// sendInbox API
router.post("/sendInbox", async (req, res) => {
  try {
    const { inbox } = req.body;
    const inboxx = new Inbox(inbox);
    await inboxx.save();
    return res.send({ message: "Inbox sent successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getInbox API
router.get("/getInbox/:id", async (req, res) => {
  try {
    let inboxID = req.params.id;
    let inbox = await Inbox.findById({ _id: inboxID });
    return res.send(inbox);
  } catch (error) {
    return res.send({ error });
  }
});

// getAllUnreadInboxes API
router.get("/getAllUnreadInboxes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inboxes = await Inbox.find({ read: false, to: ObjectId(id) });
    return res.send({ numOfUnread: inboxes.length });
  } catch (error) {
    return res.send({ error });
  }
});

// getInboxesForTeacher API
router.get("/getInboxesForTeacher/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inboxes = await Inbox.find({ to: ObjectId(id) }).sort({
      sentAt: "-1",
    });
    return res.send(inboxes);
  } catch (error) {
    return res.send({ error });
  }
});

// getInboxesForStudent API
router.get("/getInboxesForStudent/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inboxes = await Inbox.find({ to: ObjectId(id) }).sort({
      sentAt: "-1",
    });
    return res.send(inboxes);
  } catch (error) {
    return res.send({ error });
  }
});

// deleteInbox API
router.delete("/deleteInbox/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const inbox = await Inbox.findByIdAndDelete({ _id: id });
    return res.send({ message: "Inbox deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// inboxRead API
router.patch("/inboxRead", async (req, res) => {
  try {
    const { id } = req.body;
    const inbox = await Inbox.findById({ _id: id });
    inbox.read = true;
    await inbox.save();
    return res.send({ message: "Inbox read successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// broadcastToAllStudents API
router.post("/broadcastToAllStudents", async (req, res) => {
  try {
    const { inboxx } = req.body;
    let students = await Student.find();
    for (const student of students) {
      let inbox = { ...inboxx, to: student._id };
      await new Inbox(inbox).save();
    }
    return res.send({ message: "Broadcasted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// broadcastToAllTeachers API
router.post("/broadcastToAllTeachers", async (req, res) => {
  try {
    const { inboxx } = req.body;
    let teachers = await Teacher.find();
    for (const teacher of teachers) {
      let inbox = { ...inboxx, to: teacher._id };
      await new Inbox(inbox).save();
    }
    return res.send({ message: "Broadcasted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
