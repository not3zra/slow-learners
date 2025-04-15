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

exports.deleteAttendance = async (req, res) => {
  try {
      const { studentId, sessionId } = req.params;

      // Log to verify the studentId and sessionId received in the request
      console.log(`Deleting attendance for studentId: ${studentId} and sessionId: ${sessionId}`);

      // Find matching records before deletion (for debugging purposes)
      const attendanceRecords = await Attendance.find({
          student: studentId,
          session: sessionId,
      });

      if (attendanceRecords.length === 0) {
          return res.status(200).json({ message: "No attendance records found for this student and session" });
      }

      console.log(`Found ${attendanceRecords.length} records to delete`);

      // Delete all matching records
      const deletedAttendance = await Attendance.deleteMany({
          student: studentId,
          session: sessionId,
      });

      res.status(200).json({
          message: `Successfully deleted ${deletedAttendance.deletedCount} attendance record(s)`,
      });
  } catch (error) {
      console.error("Error deleting attendance:", error);
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
