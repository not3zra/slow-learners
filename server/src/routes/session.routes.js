const express = require('express');
const Session = require('../models/session.model')

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().populate('teacherId','name').populate('sessionId','name')
        res.json(sessions)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 })

 const { body, validationResult } = require('express-validator');

 router.post('/create', 
    [
    body('teacherId').isMongoId().withMessage('Invalid teacher ID.'),
    body('classroomId').isMongoId().withMessage('Invalid classroom ID.'),
    body('subject').isString().trim().notEmpty().withMessage('Subject is required.'),
    body('schedule.type').isIn(['single', 'weekly', 'semester-long']).withMessage('Invalid schedule type.'),
    body('schedule.startDate').isISO8601().withMessage('Invalid start date.'),
    body('schedule.endDate').optional().isISO8601().withMessage('Invalid end date.'),
    body('maxSeats').isInt({ min: 1 }).withMessage('Max seats must be a positive number.')
    ], 
    async (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const session = new Session(req.body);
            await session.save();
            res.status(201).json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
 })

 router.delete('/delete', async (req, res)=>{
    try {
        const session = await Session.findByIdAndDelete(req.body._id)
        res.json(session)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 })

module.exports = router