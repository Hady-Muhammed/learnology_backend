const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Post } = require("../models/postSchema");
const { React } = require("../models/reactSchema");
const { Student } = require("../models/studentSchema");
const { Comment } = require("../models/commentSchema");
const { Reply } = require("../models/replySchema");
const { ObjectId } = require("mongodb");

// createPost API
router.post("/createPost", async (req, res) => {
  try {
    const { postt } = req.body;
    postt.authorID = mongoose.Types.ObjectId(postt.authorID);
    const post = new Post(postt);
    await post.save();
    return res.send({ message: "Posted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllPosts
router.get("/getAllPosts", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "authorID",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $sort: {publishedAt: 1}
      }
    ]);
    return res.send(posts);
  } catch (error) {
    return res.send({ error });
  }
});

// getPostsOfAStudent
router.get("/getPostsOfAStudent/:studentID", async (req, res) => {
  try {
    let studentID = req.params.studentID;
    let posts = await Post.aggregate([
      {
        $match: {
          authorID: ObjectId(studentID),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "authorID",
          foreignField: "_id",
          as: "author",
        },
      },
    ]);
    return res.send(posts);
  } catch (error) {
    return res.send(error);
  }
});

// getPost
router.get("/getPost/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let post = await Post.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "authorID",
          foreignField: "_id",
          as: "author",
        },
      },
    ]);
    return res.send(post);
  } catch (error) {
    return res.send({ error });
  }
});

// deletePost API
router.post("/deletePost", async (req, res) => {
  try {
    const { postID } = req.body;
    await Post.findByIdAndDelete({ _id: postID });
    await React.deleteMany({ postID: postID });
    let students = await Student.find({ "reacts.postID": postID });
    await Comment.deleteMany({ postID: mongoose.Types.ObjectId(postID) });
    await Reply.deleteMany({ postID: mongoose.Types.ObjectId(postID) });

    for (let j = 0; j < students.length; j++) {
      let index = students[j].reacts.findIndex(
        (react) => react.postID === postID
      );
      while (index != -1) {
        students[j].reacts.splice(index, 1);
        index = students[j].reacts.findIndex(
          (react) => react.postID === postID
        );
      }
      await students[j].save();
    }
    return res.send({ message: "Post deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
