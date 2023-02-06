const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { Comment } = require("../models/commentSchema");
const { Post } = require("../models/postSchema");
const { Notification } = require("../models/notificationSchema");

// addComment API
router.post("/addComment", async (req, res) => {
  try {
    const { commentt, notificationn } = req.body;
    let comment = new Comment(commentt);
    let post = await Post.findOne({ _id: commentt.postID });
    let notification = new Notification(notificationn);
    post.comments++;
    await post.save();
    await notification.save();
    await comment.save();
    return res.send({ message: "Comment added successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getComments API
router.get("/getComments/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    const comments = await Comment.aggregate([
      {
        $match: {
          postID: ObjectId(postID),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "belongsTo",
          foreignField: "_id",
          as: "commenter",
        },
      },
    ]);
    return res.send(comments);
    // return res.send(post.comments);
  } catch (error) {
    return res.send({ error });
  }
});

// deleteComment API
router.post("/deleteComment", async (req, res) => {
  try {
    const { postID, commentID } = req.body;
    await Comment.findByIdAndDelete({ _id: commentID });
    const post = await Post.findById({ _id: postID });
    post.comments--;
    await post.save();
    return res.send({ message: "Comment deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
