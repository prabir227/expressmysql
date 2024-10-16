const express = require('express');
const morgan = require('morgan');
const pool = require('./connections/db');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(helmet());

dotenv.config();
//routes
app.use('/students', require('./connections/routes/studentRoutes'));
app.use('/notes', require('./connections/routes/noteRoutes'));
app.get("/test", (req, res) => {
    res.send("hello world");
});

//listen
pool.query('SELECT 1').then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});