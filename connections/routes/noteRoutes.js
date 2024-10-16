const express = require('express');
const notesRouter = express.Router();
const auth = require('../middlewares/auth');
const {createNotes,getNotes,deleteNote}= require('../controllers/noteController');

notesRouter.post('/create', auth, createNotes);
notesRouter.get('/list', auth, getNotes);
notesRouter.delete('/delete/:id', auth, deleteNote);

module.exports = notesRouter;