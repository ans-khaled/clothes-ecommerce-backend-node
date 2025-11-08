const Faq = require("../models/faq");
const mongoose = require("mongoose");

const addQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newQuestion = new Faq({
      question,
      answer,
    });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question is added successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error while creating Question:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Faq.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ is empty",
      });
    }

    res.status(200).json({
      success: true,
      message: "All FAQ fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Error While fetching FAQ:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    const faq = await Faq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Error while updating FAQ:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const softDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    const deletedQuestion = await Faq.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: `Question with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      data: deletedQuestion,
    });
  } catch (error) {
    console.error("Error while Deleting FAQ:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addQuestion,
  getAllQuestions,
  updateQuestion,
  softDeleteQuestion,
};
