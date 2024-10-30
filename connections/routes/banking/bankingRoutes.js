const express = require('express');

const {createUser,loginUser,deposit, withdraw,transfer}= require('../../controllers/banking/bankingController');
const bankingRouter = express.Router();
const auth = require('../../middlewares/auth');

bankingRouter.post('/create', createUser);
bankingRouter.post('/login', loginUser);
bankingRouter.patch('/deposit', auth, deposit);
bankingRouter.patch('/withdraw', auth, withdraw);
bankingRouter.patch('/transfer', auth, transfer);
module.exports = bankingRouter;