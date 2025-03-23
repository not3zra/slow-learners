const express=require('express')
const { getBookings, createBooking, cancelBooking } = require('../controllers/booking.controller')


const router = express.Router()

router.get("/", getBookings)

router.post("/create", createBooking)

router.post("/cancel", cancelBooking)

module.exports = router