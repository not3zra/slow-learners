const express=require('express')
const { getBookings, createBooking, cancelBooking, getBookingBySessionId } = require('../controllers/booking.controller')


const router = express.Router()

router.get("/", getBookings)

router.get("/:id",getBookingBySessionId)

router.post("/create", createBooking)

router.post("/cancel", cancelBooking)

module.exports = router