const express = require('express');
const ListController = require('../controllers/ListController');
const router = express.Router();

router.post('/create', ListController.create);
router.get('/:taskListId', ListController.fetchTasks);

module.exports = router;