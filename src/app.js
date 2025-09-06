const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const db = require('./config/database');
const TaskRouter = require('./routes/TaskRouter');
const ListRouter = require('./routes/ListRouter');
const AuthRouter = require('./auth/authRouter');

const setupSwagger = require("../swagger");


const middleware = express();

middleware.use(express.json());
middleware.use(cors({}))
middleware.use(morgan("dev"));

setupSwagger(middleware);

middleware.use('/task', TaskRouter);
middleware.use('/list', ListRouter);
middleware.use('/auth', AuthRouter);

middleware.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});


module.exports = middleware;