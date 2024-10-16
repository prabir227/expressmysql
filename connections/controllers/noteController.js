const {pool} = require('../db');

const createNotes = async (req, res) => {
    try{
        const {title , description} = req.body;
        if(!title || !description){
            return res.status(400).json({message: "All fields are required"});
        }
        const data = await pool.promise().query("INSERT INTO notes (title, description, userid) VALUES (?,?,?)",[title, description, req.userId]);
        if(!data){
            return res.status(500).json({message: "Failed to create note"});
        }
        res.status(201).json({message: "Note created successfully"});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to create note"});
    }
}

const getNotes = async (req, res) => {
    try{
        const data = await pool.promise().query("SELECT * FROM notes WHERE userid = ?", [req.userId]);
        if(!data){
            return res.status(500).json({message: "Failed to fetch notes"});
        }
        res.status(200).json({message: "Notes fetched successfully", data: data[0]});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to fetch notes"});
    }
}

const deleteNote = async (req, res) => {
    try{
        const noteId = req.params.id;
        if(!noteId){
            return res.status(400).json({message: "Invalid note id"});
        }
        const data = await pool.promise().query("DELETE FROM notes WHERE noteid = ?", [noteId]);
        if(!data){
            return res.status(500).json({message: "Failed to delete note"});
        }
        res.status(200).json({message: "Note deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete note"});
    }
}
module.exports = {createNotes, getNotes,deleteNote};