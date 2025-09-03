const express = require('express');
const db = require('./config/database');
const TaskRouter = require('./routes/TaskRouter');
const ListRouter = require('./routes/ListRouter');

const middleware = express();

middleware.use(express.json());

middleware.use('/task', TaskRouter);
middleware.use('/list', ListRouter);

middleware.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});


module.exports = middleware;