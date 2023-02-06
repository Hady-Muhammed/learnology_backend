const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { Post } = require("../models/postSchema");
const { React } = require("../models/reactSchema");
const { Student } = require("../models/studentSchema");
const { Comment } = require("../models/commentSchema");
const { Reply } = require("../models/replySchema");
const { Notification } = require("../models/notificationSchema");

// reactOnPost API
router.post("/reactOnPost", async (req, res) => {
  try {
    const { postID, react, studentID, notificationn } = req.body;
    let reactedBefore = await React.findOne({
      belongsTo: "post",
      owner: studentID,
      postID: postID,
    });
    let post = await Post.findById({ _id: postID });
    let student = await Student.findById({ _id: studentID });
    if (reactedBefore) {
      reactedBefore.type = react.type;
      await reactedBefore.save();
      let index = student.reacts.findIndex((react) => react.postID === postID);
      student.reacts.splice(index, 1);
      student.reacts.push({
        belongsTo: "post",
        postID: postID,
        type: react.type,
      });
    } else {
      let reactt = new React(react);
      post.reacts++;
      student.reacts.push({
        belongsTo: "post",
        postID: postID,
        type: react.type,
      });
      await reactt.save();
    }
    let AllReactsForAPost = await React.find({
      belongsTo: "post",
      postID: postID,
    });

    post.postHasLikes = postHasLikes(AllReactsForAPost) ? true : false;
    post.postHasLoves = postHasLoves(AllReactsForAPost) ? true : false;
    post.postHasWows = postHasWows(AllReactsForAPost) ? true : false;

    if (!userReactedToHimself(react, notificationn)) {
      let notification = new Notification(notificationn);
      await notification.save();
    }

    await post.save();
    await student.save();
    return res.send({ message: "Reacted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// reactOnComment API
router.post("/reactOnComment", async (req, res) => {
  try {
    const { studentID, postID, react, commentID, notificationn } = req.body;
    let reactedBefore = await React.findOne({
      belongsTo: "comment",
      postID,
      owner: studentID,
      commentIDIfAvailable: commentID,
    });
    let comment = await Comment.findById({ _id: commentID });
    let student = await Student.findById({ _id: studentID });
    if (reactedBefore) {
      reactedBefore.type = react.type;
      await reactedBefore.save();
      let index = student.reacts.findIndex((react) => react.postID === postID);
      student.reacts.splice(index, 1);
      student.reacts.push({
        belongsTo: "comment",
        postID: postID,
        type: react.type,
      });
    } else {
      let reactt = new React(react);
      await reactt.save();
      comment.reacts++;
      student.reacts.push({
        belongsTo: "comment",
        postID: postID,
        type: react.type,
      });
    }
    let AllReactsForAComment = await React.find({
      belongsTo: "comment",
      postID: postID,
      commentIDIfAvailable: commentID,
    });
    comment.commentHasLikes = commentHasLikes(AllReactsForAComment)
      ? true
      : false;
    comment.commentHasLoves = commentHasLoves(AllReactsForAComment)
      ? true
      : false;
    comment.commentHasWows = commentHasWows(AllReactsForAComment)
      ? true
      : false;

    if (!userReactedToHimself(react, notificationn)) {
      let notification = new Notification(notificationn);
      await notification.save();
    }

    await comment.save();
    await student.save();
    return res.send({ message: "Reacted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// reactOnReply API
router.post("/reactOnReply", async (req, res) => {
  try {
    const { studentID, postID, react, replyID, notificationn } = req.body;
    let reactedBefore = await React.findOne({
      belongsTo: "reply",
      postID,
      owner: studentID,
      commentIDIfAvailable: react.commentIDIfAvailable,
    });
    let student = await Student.findById({ _id: studentID });
    let reply = await Reply.findById({ _id: replyID });
    if (reactedBefore) {
      reactedBefore.type = react.type;
      await reactedBefore.save();
      let index = student.reacts.findIndex((react) => react.postID === postID);
      student.reacts.splice(index, 1);
      student.reacts.push({
        belongsTo: "reply",
        postID: postID,
        type: react.type,
      });
    } else {
      let reactt = new React(react);
      await reactt.save();
      reply.reacts++;
      student.reacts.push({
        belongsTo: "comment",
        postID: postID,
        type: react.type,
      });
    }
    let AllReactsForAReply = await React.find({
      belongsTo: "reply",
      postID: postID,
      commentIDIfAvailable: replyID,
    });
    reply.replyHasLikes = replyHasLikes(AllReactsForAReply) ? true : false;
    reply.replyHasLoves = replyHasLoves(AllReactsForAReply) ? true : false;
    reply.replyHasWows = replyHasWows(AllReactsForAReply) ? true : false;

    if (!userReactedToHimself(react, notificationn)) {
      let notification = new Notification(notificationn);
      await notification.save();
    }

    await reply.save();
    await student.save();
    return res.send({ message: "Reacted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllReactsOfPost
router.get("/getAllReactsOfPost/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    const reacts = await React.aggregate([
      {
        $match: {
          belongsTo: "post",
          postID: ObjectId(postID),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "owner",
          foreignField: "_id",
          as: "reacter",
        },
      },
    ]);
    return res.send(reacts);
  } catch (error) {
    return res.send({ error });
  }
});

// getAllReactsOfComment
router.get("/getAllReactsOfComment/:commentID", async (req, res) => {
  try {
    const commentID = req.params.commentID;
    const reacts = await React.aggregate([
      {
        $match: {
          belongsTo: "comment",
          commentIDIfAvailable: commentID,
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "owner",
          foreignField: "_id",
          as: "reacter",
        },
      },
    ]);
    return res.send(reacts);
  } catch (error) {
    return res.send({ error });
  }
});

// getAllReactsOfReply
router.get("/getAllReactsOfReply/:replyID", async (req, res) => {
  try {
    const replyID = req.params.replyID;
    const reacts = await React.aggregate([
      {
        $match: {
          belongsTo: "reply",
          commentIDIfAvailable: replyID,
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "owner",
          foreignField: "_id",
          as: "reacter",
        },
      },
    ]);
    return res.send(reacts);
  } catch (error) {
    return res.send({ error });
  }
});

function postHasLikes(reacts) {
  return reacts.find((react) => react.type === "like");
}
function postHasLoves(reacts) {
  return reacts.find((react) => react.type === "love");
}
function postHasWows(reacts) {
  return reacts.find((react) => react.type === "wow");
}
function commentHasLikes(reacts) {
  return reacts.find((react) => react.type === "like");
}
function commentHasLoves(reacts) {
  return reacts.find((react) => react.type === "love");
}
function commentHasWows(reacts) {
  return reacts.find((react) => react.type === "wow");
}
function replyHasLikes(reacts) {
  return reacts.find((react) => react.type === "like");
}
function replyHasLoves(reacts) {
  return reacts.find((react) => react.type === "love");
}
function replyHasWows(reacts) {
  return reacts.find((react) => react.type === "wow");
}
function userReactedToHimself(react, notification) {
  return react.owner === notification.belongsTo;
}
module.exports = router;
