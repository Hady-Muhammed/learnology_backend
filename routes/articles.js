const express = require("express");
const router = express.Router();
const { Article } = require("../models/articleSchema");
const { Teacher } = require("../models/teacherSchema");

// publishArticle API
router.post("/publishArticle", async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    return res.send({
      message: "Article published successfully!",
      id: article._id,
    });
  } catch (error) {
    return res.send({ error });
  }
});

// getAllArticles API
router.get("/getAllArticles", async (req, res) => {
  try {
    const articles = await Article.find();
    return res.send(articles);
  } catch (error) {
    return res.send({ error });
  }
});

// getArticle API
router.get("/getArticle/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findOne({ _id: id });
    return res.send(article);
  } catch (error) {
    return res.send({ error });
  }
});

// getArticlesByIds API
router.post("/getArticlesByIds", async (req, res) => {
  try {
    const articlesIDs = req.body.articles;
    let articles = [];
    for (let i = 0; i < articlesIDs.length; i++) {
      const article = await Article.findOne({ _id: articlesIDs[i] });
      articles.push(article);
    }
    return res.send(articles);
  } catch (error) {
    return res.send({ error });
  }
});

// addArticleToTeacher API
router.post("/addArticleToTeacher", async (req, res) => {
  try {
    const { id, email } = req.body;
    let teacher = await Teacher.findOne({ email });
    teacher.articles_published.push(id);
    await teacher.save();
    return res.send({ message: "added successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// modifyArticle API
router.post("/modifyArticle", async (req, res) => {
  try {
    const { id, modifiedArticle } = req.body;
    const article = await Article.findByIdAndUpdate(
      { _id: id },
      { ...modifiedArticle }
    );
    await article.save();
    return res.send({ message: "Article modified successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

// deleteArticle API
router.post("/deleteArticle", async (req, res) => {
  try {
    const { id, email } = req.body;
    const article = await Article.findByIdAndDelete({ _id: id });
    let teacher = await Teacher.findOne({ email });
    let indexOfArticle = teacher.articles_published.indexOf(id);
    teacher.articles_published.splice(indexOfArticle, 1);
    await teacher.save();
    return res.send({ message: "Article deleted successfully!" });
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
