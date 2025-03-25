import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  timeSlot: {
    startTime: {
      type: String, // Storing as string (e.g., "10:00 AM") for flexibility
      required: true,
    },
    endTime: {
      type: String, // Same as startTime
      required: true,
    },
  },
  sessionType: {
    type: String,
    enum: ["Single", "Week-Long", "Semester-Long", "Custom"],
    required: true,
  },
  dates: {
    type: [String], // Array of dates in 'YYYY-MM-DD' format
    required: true,
  },
  classroom: {
    type: String,
    required: true,
  },
  maxSeats: {
    type: Number,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", sessionSchema);
