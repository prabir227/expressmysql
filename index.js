const express = require('express');
const morgan = require('morgan');
const pool = require('./connections/db');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const errorMiddleware = require('./connections/middlewares/errors');
const winston = require('winston');
const expressWinston = require('express-winston');
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(helmet());

dotenv.config();
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    )
}));
//routes
app.use('/students', require('./connections/routes/studentRoutes'));
app.use('/notes', require('./connections/routes/noteRoutes'));
app.get("/test", (req, res) => {
    res.send("hello world");
});

//listen
app.use(errorMiddleware)
pool.query('SELECT 1').then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});