const Attendance = require("../models/attendance.model");

exports.markAttendance = async (req, res) => {
  try {
    const { student, session, status, markedBy } = req.body;

    const newAttendance = new Attendance({
      student,
      session,
      status,
      markedBy,
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance marked successfully", newAttendance });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteAttendance = async (req,res)=>{
    try {

        const { studentId, sessionId } = req.params; 
        const deletedAttendance = await Attendance.deleteMany({
            student: studentId,
            session: sessionId, // Ensure it belongs to the correct session
        });

        if (deletedAttendance.deletedCount===0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    } 

}

exports.getAllAttendance =async (req,res)=>{
    try {
        const attendance = await Attendance.find().populate("student").populate("session");
        res.status(200).json({ attendance });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
            }
}

exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const attendance = await Attendance.find({ session: sessionId }).populate("student", "name registerNumber");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId }).populate("session", "subject schedule");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
