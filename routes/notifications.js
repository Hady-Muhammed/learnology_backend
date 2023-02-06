const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { Notification } = require("../models/notificationSchema");

// getAllNotifications API
router.get("/getAllNotifications/:studentID", async (req, res) => {
  try {
    let studentID = req.params.studentID;
    const notifications = await Notification.aggregate([
      {
        $match: {
          belongsTo: ObjectId(studentID),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "sentBy",
          foreignField: "_id",
          as: "sender",
        },
      },
    ]);
    return res.send(notifications);
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
