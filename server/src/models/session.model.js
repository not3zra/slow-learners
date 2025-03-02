const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References the Users collection
        required: true
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',  // References the Classrooms collection
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    schedule: {
        type: {
            type: String,
            enum: ['single', 'weekly', 'semester-long'],
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: function () {
                return this.schedule.type !== 'single'; // Only required for weekly/semester-long
            }
        }
    },
    maxSeats: {
        type: Number,
        required: true,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Session", SessionSchema);
