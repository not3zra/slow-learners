const express=require('express')
const { getBookings, createBooking, cancelBooking, getBookingBySessionId } = require('../controllers/booking.controller')
const { validateCreateBooking, validateCancelBooking } = require('../middlewares/validationMiddleware')


const router = express.Router()

router.get("/", getBookings)

router.get("/:sessionId",getBookingBySessionId)

router.post("/create", validateCreateBooking, createBooking)

router.post("/cancel", validateCancelBooking, cancelBooking)

module.exports = router