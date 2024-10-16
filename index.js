const express = require('express');
const morgan = require('morgan');
const pool = require('./connections/db');
const app = express();
const port = 3000;
const dotenv = require('dotenv');


app.use(express.json());
dotenv.config();
//routes
app.use('/students', require('./connections/routes/studentRoutes'));
app.use('/notes', require('./connections/routes/noteRoutes'));
app.get("/test", (req, res) => {
    res.send("hello world");
});

//middlewares
app.use(morgan('dev'));


//listen
pool.query('SELECT 1').then(() => {
    app.listen(port, () => {
        console.log("server running");
    });
}).catch((err) => {
    console.log(err);
});