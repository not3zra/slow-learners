const Session = require('../models/session.model')

exports.getSessions= async (req, res) => {
    try {
        const sessions = await Session.find().populate('teacherId').populate('classroomId')
        res.status(201).json(sessions)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

 exports.getSession = async (req,res)=>{
    try {
        const session = await Session.findById(req.params.id).populate('teacherId').populate('classroomId')
        res.status(201).json(session)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

exports.createSession = async (req, res)=>{
         try {
             const session = new Session(req.body);
             await session.save();
             res.status(201).json({sucess: true, data: session, message: "Session created successfully"});
         } catch (error) {
             res.status(500).json({ error: error.message });
         }
  }

exports.deleteSession = async (req, res)=>{
    try {
        const session = await Session.findByIdAndDelete(req.params.id)
        if(!session){
            res.status(404).json({ message: "Session not found" })
        }
        res.status(201).json({success: true, data: session, message: "Session deleted successfully"})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

