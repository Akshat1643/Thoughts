import mongoose from 'mongoose';

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String, 
    required: true,  
  },
  userId: {
    type: String,
    required: true,
  },
}, { timestamps: true }); 

const NotesModel = mongoose.model('Notes', NotesSchema);
export default NotesModel;