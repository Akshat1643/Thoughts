import express from "express"
import {Verification}from "../middleware/Verification.js"
import { AuthCheck, create, deleteNotes, getnotes, updateNotes } from "../controllers/Notes.js"

const NotesRoutes = express.Router()

NotesRoutes.post('/createnote',Verification,create)
NotesRoutes.get('/getnotes',Verification,getnotes)
NotesRoutes.put('/update/:id',Verification,updateNotes)
NotesRoutes.delete('/delete/:id',Verification,deleteNotes);
NotesRoutes.post('/authCheck',Verification,AuthCheck)
export default NotesRoutes