const Session = require('../models/session.model')

exports.getSessions= async (req, res) => {
    try {
        const sessions = await Session.find().populate('teacherId','name').populate('_id','name')
        res.json(sessions)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }

exports.createSession = async (req, res)=>{
         try {
             const session = new Session(req.body);
             await session.save();
             res.status(201).json(session);
         } catch (error) {
             res.status(500).json({ error: error.message });
         }
  }

exports.deleteSession = async (req, res)=>{
    try {
        const session = await Session.findByIdAndDelete(req.body.id)
        res.json(session)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
 }