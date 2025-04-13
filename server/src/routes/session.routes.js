const express = require('express');
const { validateCreateSession, validateDeleteSession } = require('../middlewares/validationMiddleware');
const { getSessions, createSession, deleteSession, getSession } = require('../controllers/session.controller');

const router = express.Router();
router.get('/list', getSessions)

router.get('/:sessionId', getSession)

router.get('/get-session', getSession)

// TODO: FIX Validation for create session
router.post('/create', validateCreateSession, createSession)

router.delete('/delete', validateDeleteSession, deleteSession)

module.exports = router