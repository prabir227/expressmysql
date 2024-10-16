const joi = require('joi');

const userValidationSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required()
})

const userCreationSchema = joi.object({
    name : joi.string().required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).required()
})

const noteCreationSchema = joi.object({
    title : joi.string().required(),
    description : joi.string().required()
})

module.exports = {userValidationSchema, userCreationSchema, noteCreationSchema};