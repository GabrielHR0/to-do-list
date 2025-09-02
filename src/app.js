const express = require('express');
const db = require('./config/database');
const controller = require('./controllers/UserController');


const middleware = express();

middleware.use(express.json());

middleware.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

middleware.get('/create', async (req, res) => {
    const usuario = {
        email: "jales@gmail.com",
        password: "12345"
    }
    const result = await controller.create(usuario);
    res.send(result);
})

middleware.get('/id', async (req, res) => {
    const id = 1;
    const result = await controller.findById(id);
    res.send(result);
})

module.exports = middleware;