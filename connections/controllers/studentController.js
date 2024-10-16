const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRET_KEY;
const { userCreationSchema, userValidationSchema } = require("../models/joiSchemas");
// Get all students
const getStudents = async (req,res)=>{
    try {
        const data = await pool.promise().query("SELECT id, name, email, password FROM students");
        if(!data){
            return res.status(404).send({
                success: false,
                message: "No data found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: data[0]
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send(
            {
                success: false,
                messgage: "Failed to fetch student data",
                error: error
            }
        )
    }

}
// Get student by id
const getStudentById = async(req,res)=>{
    try {
        const studentId = req.params.id;
        if(!studentId){
            return res.status(400).send({
                success: false,
                message: "Invalid student id"
            })
        }

        const data = await pool.promise().query("SELECT id, name, email, password FROM students WHERE id = ?",[studentId]);
        if(!data){
            return res.status(404).send({
                success: false,
                message: "No data found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Data fetched successfully",
            data: data[0]
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send(
            {
                success: false,
                messgage: "Failed to fetch student data",
                error: error
            }
        )
    }
}
// Create student

const createStudent = async(req,res)=>{
    try {
        const user = await userCreationSchema.validateAsync(req.body);
        const data = await pool.promise().query("INSERT INTO students (name, email, password) VALUES (?,?,?)",[user.name, user.email, user.password]);
        if(!data){
            return res.status(500).send({
                success: false,
                message: "Failed to create student"
            })
        }
        res.status(201).send({
            success: true,
            message: "Student created successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to create student",
            error: error
        }
    )
    }
};
const updateStudent = async(req,res)=>{
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
            return res.status(500).send({
                success: false,
                message: "Failed to update student"
            })
        }
        res.status(200).send({
            success: true,
            message: "Student updated successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to update student",
            error: error
        }
    )
    }
}
const deleteStudent = async(req,res)=>{
    try {
        const studentId = req.params.id;
        if(!studentId){
            return res.status(500).send({
                success: false,
                message: "Invalid student id"
            })
        }
        const data = await pool.promise().query("DELETE FROM students WHERE id = ?",[studentId]);
        if(!data){
            return res.status(500).send({
                success: false,
                message: "Failed to delete student"
            })
        }
        res.status(200).send({
            success: true,
            message: "Student deleted successfully",
            data: data[0]
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to delete student",
            error: error
        }
    )
    }
};

const signIn = async (req, res) => {
    try {
        const user = await userValidationSchema.validateAsync(req.body);
        const [data] = await pool.promise().query("SELECT id, name, email, password FROM students WHERE email = ? AND password = ?", [user.email, user.password]);
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
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
        res.status(500).send({
            success: false,
            message: "Failed to sign in",
            error: error.message
        });
    }
};


module.exports={getStudents,getStudentById,createStudent,updateStudent,deleteStudent,signIn};