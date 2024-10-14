const express = require('express');
const morgan = require('morgan');
const pool = require('./connections/db');
const app = express();
const port = 3000;

app.use(express.json());
//routes
app.use('/students', require('./connections/routes/studentRoutes'));
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