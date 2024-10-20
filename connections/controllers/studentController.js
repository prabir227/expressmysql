const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRET_KEY;
const { userCreationSchema, userValidationSchema } = require("../models/joiSchemas");
const AppError = require("../models/centralErrorHandlers");
// Get all students
const getStudents = async (req,res,next)=>{
    try {
        const data = await pool.promise().query("SELECT id, name, email, password FROM students");
        if(!data){
            return next(new AppError("No data found",404));
        }
        res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: data[0]
        })
        
    } catch (error) {
        console.log(error);
        next(error);
    }

}
// Get student by id
const getStudentById = async(req,res,next)=>{
    try {
        const studentId = req.params.id;
        if(!studentId){
            return next(new AppError("Invalid student id",404));
        }

        const data = await pool.promise().query("SELECT id, name, email, password FROM students WHERE id = ?",[studentId]);
        if(data[0].length===0){
            return next(new AppError("No data found",404));
        }
        res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: data
        })
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}
// Create student

const createStudent = async(req,res,next)=>{
    try {
        const user = await userCreationSchema.validateAsync(req.body);
        const data = await pool.promise().query("INSERT INTO students (name, email, password) VALUES (?,?,?)",[user.name, user.email, user.password]);
        if(!data){
            return next(new AppError("Failed to create student",500));
        }
        res.status(201).send({
            success: true,
            message: "Student created successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        next(error);
    }
};
const updateStudent = async(req,res,next)=>{
    try {
        const studentId = req.params.id;
        const {name, email, password} = req.body;
        if(!studentId || !name || !email){
            return res.status(500).send({
                success: false,
                message: "Please provide name and email"
            })
        }
        const data = await pool.promise().query("UPDATE students SET name = ?, email = ?, password = ? WHERE id = ?",[name,email,password,studentId]);
        if(!data){
            return next(new AppError("Failed to update student",500));
        }
        res.status(200).send({
            success: true,
            message: "Student updated successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        next(error);
    }
}
const deleteStudent = async(req,res)=>{
    try {
        const studentId = req.params.id;
        if(!studentId){
            return next(new AppError("Invalid student id",404));
        }
        const data = await pool.promise().query("DELETE FROM students WHERE id = ?",[studentId]);
        if(!data){
            return next(new AppError("Failed to delete student",500));
        }
        res.status(200).send({
            success: true,
            message: "Student deleted successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        next(error);
    }
};

const signIn = async (req, res,next) => {
    try {
        const user = await userValidationSchema.validateAsync(req.body);
        const [data] = await pool.promise().query("SELECT id, name, email, password FROM students WHERE email = ? AND password = ?", [user.email, user.password]);
        if (data.length === 0) {
            return next(new AppError("Invalid email or password", 401));
        }
        const token = jwt.sign({ email: data[0].email, id : data[0].id}, SECRETKEY);   
        res.status(200).send({
            success: true,
            message: "Sign in successful",
            data: data[0],
            token: token
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


module.exports={getStudents,getStudentById,createStudent,updateStudent,deleteStudent,signIn};