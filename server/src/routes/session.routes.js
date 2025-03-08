const express = require('express');
const { validateCreateSession, validateDeleteSession } = require('../middlewares/validationMiddleware');
const { getSessions, createSession, deleteSession } = require('../controllers/session.controller');

const router = express.Router();
router.get('/', getSessions)

router.post('/create', validateCreateSession, createSession)

router.delete('/delete', validateDeleteSession, deleteSession)

module.exports = router