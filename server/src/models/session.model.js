const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    scheduleType: {
        type: String,
        enum: ["single", "weekly", "semester-long"],
        required: true,
    },
    schedule: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: function () {
                return this.scheduleType !== "single"; // Only required for weekly/semester-long
            },
        },
        timeSlot: {
            type: String, // Example: "10:00 AM - 12:00 PM"
            required: true,
        },
    },
    maxSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Session", SessionSchema);
