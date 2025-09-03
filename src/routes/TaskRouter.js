const Task = require('../controllers/TaskController');
const express = require('express');
const router = express.Router();

router.post('/create', Task.create);


module.exports = router;


