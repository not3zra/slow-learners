const Booking=require('../models/booking.model');
const Session=require('../models/session.model');

exports.getBookings = async(req,res) => {
    try {
        const bookings = await Booking.find().populate('sessionId').populate('studentId');
        res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.getBookingBySessionId =  async(req,res)=>{
    try {
        const booking = await Booking.find({sessionId:req.params.sessionId}).populate('sessionId').populate('studentID')
        res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.createBooking = async (req,res) =>{
    try {
        const {sessionId} = req.body;
        const session = await Session.findById(sessionId);
        
        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }
        if(session.maxSeats<=0){
            return res.status(404).json({ message: "Session is full" });
        }
        else{
            const booking = new Booking(req.body);
            await booking.save();
            session.maxSeats-=1;
            res.status(201).json({success: true, data: booking, message: "Booking successful"});
        }  
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}

exports.cancelBooking = async (req,res) =>{
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
   
        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }
        if(booking.status=='canceled'){
            return res.status(404).json({ message: "Booking is already canceled" });
        }
        const session = Session.findByIdAndUpdate(booking.sessionId,{$inc:{maxSeats:1}});
        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }

        booking.status='canceled';
        await booking.save();
        res.json(booking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}
