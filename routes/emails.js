const express = require("express");
const router = express.Router();
const { Email } = require("../models/emailSchema");
const { ObjectId } = require("mongodb");

// sendEmail API
router.post("/sendEmail", async (req, res) => {
  try {
    const { email } = req.body;
    const emaill = new Email(email);
    await emaill.save();
    return res.send({ message: "Email sent successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllEmails API
router.get("/getAllEmails", async (req, res) => {
  try {
    const emails = await Email.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "belongsTo",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      { $sort: { sentAt: -1 } },
    ]);
    return res.send(emails);
  } catch (error) {
    return res.send({ error });
  }
});

// getEmail API
router.get("/getEmail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const email = await Email.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "belongsTo",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
    ]);
    return res.send(email);
  } catch (error) {
    return res.send({ error });
  }
});

// emailRead API
router.patch("/emailRead", async (req, res) => {
  try {
    const { id } = req.body;
    const email = await Email.findById({ _id: id });
    email.read = true;
    await email.save();
    return res.send({ message: "Email read successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// emailGotReplied API
router.patch("/emailGotReplied", async (req, res) => {
  try {
    const { emailID } = req.body;
    const email = await Email.findById({ _id: emailID });
    email.replied = true;
    await email.save();
    return res.send({ message: "Email updated successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteEmail API
router.delete("/deleteEmail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const email = await Email.findByIdAndDelete({ _id: id });
    return res.send({ message: "Email deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllUnreadEmails API
router.get("/getAllUnreadEmails", async (req, res) => {
  try {
    const emails = await Email.find({ read: false });
    return res.send({ numOfUnread: emails.length });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
