const express = require("express");
const Classroom = require("../models/classroom.model");

const router = express.Router();

// Fetch all classrooms from the database
router.get("/list", async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// TODO: Authorize before creation
router.post("/add", async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const newClass = new Classroom({
      name,
      capacity,
    });
    await newClass.save();
    res.status(200).json({ message: "Classroom added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
