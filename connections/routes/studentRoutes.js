const express = require('express');
const { getStudents,getStudentById,createStudent,updateStudent,deleteStudent, signIn } = require('../controllers/studentController');    

const router = express.Router();
// List all students
router.get('/list', getStudents);
// Get student by their id
router.get('/:id', getStudentById);
// Create a new student
router.post('/create', createStudent);
// Update student by their id
router.put('/update/:id', updateStudent);
// Delete student by their id
router.delete('/delete/:id', deleteStudent);
// Sign in student
router.post('/signin',signIn)
module.exports = router;