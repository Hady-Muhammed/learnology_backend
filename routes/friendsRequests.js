const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { FriendReq } = require("../models/friendReqSchema");
const { Student } = require("../models/studentSchema");

// getFriendRequests
router.get("/getFriendRequests/:studentID", async (req, res) => {
  try {
    let studentID = req.params.studentID;
    let markRequestsAsRead = await FriendReq.find({
      to: ObjectId(studentID),
      read: false,
    });
    for (const req of markRequestsAsRead) {
      req.read = true;
      await req.save();
    }
    const requests = await FriendReq.aggregate([
      {
        $match: {
          to: ObjectId(studentID),
          read: true,
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "from",
          foreignField: "_id",
          as: "sender",
        },
      },
    ]);

    return res.send(requests);
  } catch (error) {
    return res.send({ error });
  }
});

// getStudentRequests API
router.get("/getStudentRequests/:fromStudentID", async (req, res) => {
  try {
    const fromStudentID = req.params.fromStudentID;
    const requests = await FriendReq.find({ from: fromStudentID });
    return res.send(requests);
  } catch (error) {
    return res.send({ error });
  }
});

// getNoOfUnreadFriendRequests API
router.get("/getNoOfUnreadFriendRequests/:toStudentID", async (req, res) => {
  try {
    const toStudentID = req.params.toStudentID;
    const requests = await FriendReq.find({
      to: ObjectId(toStudentID),
      read: false,
    });
    return res.send({ numOfRequests: requests?.length });
  } catch (error) {
    return res.send({ error });
  }
});

// sendFriendRequest API
router.post("/sendFriendRequest", async (req, res) => {
  try {
    const { request } = req.body;
    let friendReq = new FriendReq(request);
    await friendReq.save();
    return res.send({ message: "Request sent successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// acceptRequest API
router.post("/acceptRequest", async (req, res) => {
  try {
    const { person1, person2, requestID } = req.body;
    let student1 = await Student.findById({ _id: person1._id });
    let student2 = await Student.findById({ _id: person2._id });
    student1.friends.push(student2._id);
    student2.friends.push(student1._id);
    await student1.save();
    await student2.save();
    let acceptedFriendRequest = await FriendReq.findByIdAndDelete({
      _id: requestID,
    });
    return res.send({ message: "Friend added successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// rejectRequest API
router.post("/rejectRequest", async (req, res) => {
  try {
    const { requestID } = req.body;
    let rejectedFriendRequest = await FriendReq.findByIdAndDelete({
      _id: requestID,
    });
    return res.send({ message: "Request rejected successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
