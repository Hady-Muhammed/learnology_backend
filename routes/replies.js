const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { Reply } = require("../models/replySchema");
const { Comment } = require("../models/commentSchema");
const { Notification } = require("../models/notificationSchema");

// getReplies API
router.get("/getReplies/:commentID", async (req, res) => {
  try {
    const commentID = req.params.commentID;
    const replies = await Reply.aggregate([
      {
        $match: {
          commentID: ObjectId(commentID),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "belongsTo",
          foreignField: "_id",
          as: "replier",
        },
      },
    ]);
    return res.send(replies);
  } catch (error) {
    return res.send({ error });
  }
});

// addReply API
router.post("/addReply", async (req, res) => {
  try {
    const { replyy, notificationn } = req.body;
    if (!userRepliedToHimself(replyy, notificationn)) {
      let notification = new Notification(notificationn);
      await notification.save();
    }
    let reply = new Reply(replyy);
    await reply.save();
    let comment = await Comment.findById({ _id: replyy.commentID });
    comment.replies++;
    await comment.save();
    return res.send({ message: "Reply added successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteReply API
router.post("/deleteReply", async (req, res) => {
  try {
    const { replyID, commentID } = req.body;
    await Reply.findByIdAndDelete({ _id: replyID });
    let comment = await Comment.findById({ _id: commentID });
    comment.replies--;
    await comment.save();
    return res.send({ message: "Reply deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

function userRepliedToHimself(replyy, notification) {
  return replyy.belongsTo === notification.belongsTo;
}
module.exports = router;
