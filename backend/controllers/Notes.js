import NotesModel from "../models/Notes.js"


const create = async(req,res)=>{
    try {
        const userId = req.userID 
        const {title,body} = req.body
        
        const NewNotes = new NotesModel({
            title,
            body,
            userId
        })
        await NewNotes.save()
        res.status(201).json({
            success: true,
            message: " Notes created successfully",
            notes: NewNotes,
          });
    } catch (error) {
        {
            console.log(error);
            res.status(500).json({
              success: false,
              message: "Internal server error. Please try again later.",
            });
          }
    }
}
const getnotes = async(req,res)=>{
    const userId = req.userID 
    const Notes = await NotesModel.find({userId})
    res.status(200).json({success:true,Notes})
}
const updateNotes = async (req, res) => {
    try {
      const userId = req.userID.toString(); // Ensure it's a string
      const NotesId = req.params.id;
      const { title, body } = req.body;
  
      console.log("Updating Note:", NotesId);
      console.log("Title:", title, "Body:", body);
      console.log("UserID from req:", userId);
  
      const FindNotes = await NotesModel.findById(NotesId);
  
      if (!FindNotes) {
        return res.status(404).json({ success: false, message: "Notes not found" });
      }
  
      console.log("UserID from DB:", FindNotes.userId.toString());
  
      if (userId !== FindNotes.userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: Wrong user" });
      }
  
      const updatedNote = await NotesModel.findByIdAndUpdate(
        NotesId,
        { title, body },
        { new: true }
      );
  
      if (!updatedNote) {
        return res.status(400).json({ success: false, message: "Failed to update note" });
      }
  
      res.status(200).json({
        success: true,
        message: "Note updated successfully",
        note: updatedNote,
      });
    } catch (error) {
      console.log("Error while updating:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
const deleteNotes = async (req, res) => {
    try {
      const userId = req.userID.toString(); // Get and convert userID to string
      const NotesId = req.params.id;
  
      console.log("Deleting Note:", NotesId);
      console.log("UserID from req:", userId);
  
      const FindNotes = await NotesModel.findById(NotesId);
  
      if (!FindNotes) {
        return res.status(404).json({ success: false, message: "Note not found" });
      }
  
      console.log("UserID from DB:", FindNotes.userId.toString());
  
      if (userId !== FindNotes.userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: Wrong user" });
      }
  
      await NotesModel.findByIdAndDelete(NotesId);
  
      res.status(200).json({
        success: true,
        message: "Note deleted successfully",
      });
  
    } catch (error) {
      console.log("Error while deleting:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  const AuthCheck = async (req, res) => {
    try {
      const userId = req.userID?.toString();
      if (userId) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  
export {create,getnotes,updateNotes,deleteNotes,AuthCheck}