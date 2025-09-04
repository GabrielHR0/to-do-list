const Task = require('../controllers/TaskController');
const express = require('express');
const router = express.Router();

router.post('/create', Task.create);
router.get('/complete/:taskId', Task.finish);
router.get('/open/:taskId', Task.reOpen);


module.exports = router;


