const {pool} = require('../../db');
const jwt = require('jsonwebtoken');
const SECRETKEY = process.env.SECRET_KEY;
const {userCreationSchema,userLoginSchema,transferSchema} = require('../../models/banking/joiSchemas');
const AppError = require('../../models/centralErrorHandlers');

const createUser = async (req, res, next) => {
    try{
        const user = await userCreationSchema.validateAsync(req.body);
        const data = await pool.promise().query("INSERT INTO customers (name, email, phone_number, password) VALUES (?,?,?,?)",[user.name, user.email, user.phone_number, user.password]);
        console.log(data[0]);
        const accountData = await pool.promise().query("INSERT INTO accounts (customer_id, balance) VALUES (?,?)",[data[0].insertId, 0]);
        if(!data || !accountData){
            console.log(data);
            return next(new AppError("Failed to create user", 500));
        }
        res.status(201).send({
            success: true,
            message: "User created",
        });
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    try{
        const user = await userLoginSchema.validateAsync(req.body);
        const data = await pool.promise().query("SELECT * FROM customers WHERE email = ? AND password = ?", [user.email,user.password]);
        if(data[0].length === 0){
            return next(new AppError("Invalid email or password", 401));
        }
        const token = jwt.sign({email: user.email,customerId : data[0][0].customer_id}, SECRETKEY);
        res.status(200).send({
            success: true,
            message: "User logged in",
            token: token
        });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const deposit = async (req, res, next) => {
    try{
        const amount = parseInt(req.body.amount,10);
        const customerId = req.userId;
        console.log(customerId);
        if(!amount){
            return next(new AppError("Invalid amount", 400));
        }
        const accountData = await pool.promise().query("SELECT * FROM accounts WHERE customer_id = ?", [customerId]);
        if(accountData[0].length === 0){
            return next(new AppError("Account not found", 404));
        }
        const accountBalance = parseInt(accountData[0][0].balance,10);
        const newBalance = accountBalance+amount;
        const data = await pool.promise().query("UPDATE accounts SET balance = ? WHERE customer_id = ?", [newBalance, customerId]);
        if(!data){
            return next(new AppError("Failed to deposit amount", 500));
        }
        res.status(200).send({
            success: true,
            message: "Amount deposited successfully",
            balance : newBalance
        });
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

const withdraw = async (req, res, next) => {
    try{
        const amount = parseInt(req.body.amount,10);
        const customerId = req.userId;
        if(!amount){
            return next(new AppError("Invalid amount", 400));
        }
        const accountData = await pool.promise().query("SELECT * FROM accounts WHERE customer_id = ?", [customerId]);
        if(accountData[0].length === 0){
            return next(new AppError("Account not found", 404));
        }
        const accountBalance = parseInt(accountData[0][0].balance,10);
        if(accountBalance < amount){
            return next(new AppError("Insufficient balance", 400));
        }
        const newBalance = accountBalance-amount;
        const data = await pool.promise().query("UPDATE accounts SET balance = ? WHERE customer_id = ?", [newBalance, customerId]);
        const transactionData = await pool.promise().query("INSERT INTO transactions (account_id, amount, type) VALUES (?,?,?)", [accountData[0][0].account_id, amount, "withdraw"]);
        if(!data || !transactionData){
            return next(new AppError("Failed to withdraw amount", 500));
        }
        res.status(200).send({
            success: true,
            message: "Amount withdrawn successfully",
            balance : newBalance
        });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}
const transfer = async (req, res, next) => {
    try{
        const transferData = await transferSchema.validateAsync(req.body);
        const customerId = req.userId;
        const destination = await pool.promise().query("SELECT * FROM customers WHERE email = ?", [transferData.email]);
        if(destination[0].length === 0){
            return next(new AppError("Receiver not found", 404));
        }
        const fromAccountData = await pool.promise().query("SELECT * FROM accounts WHERE customer_id = ?", [customerId]);
        const destinationAccountData = await pool.promise().query("SELECT * FROM accounts WHERE customer_id = ?", [destination[0][0].customer_id]);
        if(fromAccountData[0].length === 0 || destinationAccountData[0].length === 0){
            return next(new AppError("Account not found", 404));
        }
        const fromAccountBalance = parseInt(fromAccountData[0][0].balance,10);
        const destinationAccountBalance = parseInt(destinationAccountData[0][0].balance,10);
        if(fromAccountBalance < transferData.amount){
            return next(new AppError("Insufficient balance", 400));
        }
        const newFromBalance = fromAccountBalance - transferData.amount;
        const newDestinationBalance = destinationAccountBalance + transferData.amount;
        const updatedFromData = await pool.promise().query("UPDATE accounts SET balance = ? WHERE customer_id = ?", [newFromBalance, customerId]);
        const updatedDestinationData = await pool.promise().query("UPDATE accounts SET balance = ? WHERE customer_id = ?", [newDestinationBalance, destination[0][0].customer_id]);
        const updatedTransactionData = await pool.promise().query("INSERT INTO transactions (account_id, amount, type) VALUES (?,?,?)", [fromAccountData[0][0].account_id, transferData.amount, "transfer"]);
        const transfers = await pool.promise().query("INSERT INTO transfers (source_id, destination_id, amount,transaction_id) VALUES (?,?,?,?)", [fromAccountData[0][0].account_id, destinationAccountData[0][0].account_id, transferData.amount, updatedTransactionData[0].insertId]);
        if(!updatedFromData || !updatedDestinationData || !updatedTransactionData || !transfers){
            return next(new AppError("Failed to transfer amount", 500));
        }
        res.status(200).send({
            success: true,
            message: "Amount transferred successfully",
            balance : newFromBalance
        });
    }
    catch(err){
        console.log(err);
        next(err);
    }
};
module.exports = {createUser, loginUser,deposit,withdraw,transfer};