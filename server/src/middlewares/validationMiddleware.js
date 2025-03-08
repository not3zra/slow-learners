
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

exports.validateDelete= [
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