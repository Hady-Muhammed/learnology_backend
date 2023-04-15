const express = require("express");
const router = express.Router();
const { Section } = require("../models/sectionSchema");
const { Course } = require("../models/courseSchema");
const { ObjectId } = require("mongodb");

// createSection API
router.post("/createSection", async (req, res) => {
  try {
    const { section } = req.body;
    const sectionn = await new Section(section).save();
    const course = await Course.findById(section.courseID);
    course.sections.push(sectionn._id);
    await course.save();
    return res.send({ message: "Section created successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// getVideo API
router.post("/getVideo", async (req, res) => {
  try {
    const { courseID, videoID, sectionID } = req.body;
    const section = await Section.findById({ _id: ObjectId(sectionID) });
    console.log(sectionID,courseID)
    console.log(section)
    const video = section.videos.find(vid => vid._id == videoID)
    return res.send(video)
  } catch (error) {
    console.log(error);
    return res.send({ error });
  }
});

module.exports = router;
