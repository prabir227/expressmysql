const joi = require('joi');

const userCreationSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone_number: joi.string().min(10).required(),
    password: joi.string().required()
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}); 

const transferSchema = joi.object({
    amount: joi.number().required(),
    email: joi.string().email().required()
});
module.exports = {userCreationSchema, userLoginSchema, transferSchema};