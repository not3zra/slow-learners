
const { body, validationResult } = require('express-validator');

exports.validateSignUp=[
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['student', 'teacher']).withMessage('Role must be either "student" or "teacher"'),
  
  body('registerNumber')
    .if(body('role').equals('student')) // Only validate if role is 'student'
    .notEmpty().withMessage('Register number is required for students')
    .isNumeric().withMessage('Register number must be a number'),
  
  body('programme')
    .if(body('role').equals('student')) // Only validate if role is 'student'
    .notEmpty().withMessage('Programme is required for students')
    .isString().withMessage('Programme must be a string'),

    async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    ];

exports.validateLogIn=[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateDeleteUser= [
    body('id').isMongoId().withMessage('Invalid id'),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
  ]

exports.validateGetSubjects=[
    body('id').isMongoId().withMessage('Invalid id'),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
  ]

exports.validateCreateSession=[
    body('teacherId').isMongoId().withMessage('Invalid teacher ID.'),
    body('classroomId').isMongoId().withMessage('Invalid classroom ID.'),
    body('subject').isString().trim().notEmpty().withMessage('Subject is required.'),
    body('scheduleType').isIn(['single', 'weekly', 'semester-long']).withMessage('Invalid schedule type.'),
    body('schedule.startDate').isISO8601().withMessage('Invalid start date.'),
    body('schedule.endDate').optional().isISO8601().withMessage('Invalid end date.'),
    body('schedule.timeSlot').isString().trim().notEmpty().withMessage('Time Slot invalid'),
    body('maxSeats').isInt({ min: 1 }).withMessage('Max seats must be a positive number.'),
    
    async (req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateDeleteSession=[
    body('id').isMongoId().withMessage('Invalid id'),
    async(req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }   
]