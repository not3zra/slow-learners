const Classroom = require("../models/classroom.model");

exports.fetchAll = async (req, res) => {
   try {
     const classrooms = await Classroom.find();
     res.status(200).json(classrooms);
   } catch (error) {
     res.status(500).json({ message: "Server Error", error: error.message });
   }   
}

exports.deleteClass = async (req, res) => {
      try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}