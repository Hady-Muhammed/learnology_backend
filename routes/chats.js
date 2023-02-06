const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { Chat } = require("../models/chatSchema");

// sendMessage API
router.post("/sendMessage", async (req, res) => {
  try {
    const { message, id } = req.body;
    const chat = await Chat.findOne({ _id: id });
    chat.messages.push(message);
    await chat.save();
    return res.send({ message: "Message sent successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// createChat API
router.post("/createChat", async (req, res) => {
  try {
    const { chat } = req.body;
    const chatExists = await Chat.findOne({
      $or: [
        {
          $and: [
            { person1_ID: ObjectId(chat.person1_ID) },
            { person2_ID: ObjectId(chat.person2_ID) },
          ],
        },
        {
          $and: [
            { person1_ID: ObjectId(chat.person2_ID) },
            { person2_ID: ObjectId(chat.person1_ID) },
          ],
        },
      ],
    });
    if (chatExists)
      return res.send({ message: "Chat already exists", id: chatExists._id });
    const conversation = new Chat(chat);
    await conversation.save();
    return res.send({
      message: "Conversation started successfully!",
      id: conversation._id,
    });
  } catch (error) {
    return res.send({ error });
  }
});

// getChats API
router.get("/getChats/:personID", async (req, res) => {
  try {
    const personID = req.params.personID;
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { person1_ID: ObjectId(personID) },
            { person2_ID: ObjectId(personID) },
          ],
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "person1_ID",
          foreignField: "_id",
          as: "person1a",
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "person1_ID",
          foreignField: "_id",
          as: "person1b",
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "person2_ID",
          foreignField: "_id",
          as: "person2a",
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "person2_ID",
          foreignField: "_id",
          as: "person2b",
        },
      },
    ]);
    return res.send(chats);
  } catch (error) {
    return res.send({ error });
  }
});

// getSingleChat API
router.get("/getSingleChat/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const chat = await Chat.findById({ _id: id });
    const chat = await Chat.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "person1_ID",
          foreignField: "_id",
          as: "person1a",
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "person1_ID",
          foreignField: "_id",
          as: "person1b",
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "person2_ID",
          foreignField: "_id",
          as: "person2a",
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "person2_ID",
          foreignField: "_id",
          as: "person2b",
        },
      },
    ]);
    return res.send(chat);
  } catch (error) {
    return res.send({ error });
  }
});

// setNewMessages API
router.post("/setNewMessages", async (req, res) => {
  try {
    const { newMessages, id } = req.body;
    const chat = await Chat.findById({ _id: id });
    chat.newMessages = newMessages;
    await chat.save();
    return res.send({ message: "changed successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteChat API
router.post("/deleteChat", async (req, res) => {
  try {
    const { id } = req.body;
    await Chat.findByIdAndDelete({ _id: id });
    return res.send({ message: "Chat deleted succesfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
