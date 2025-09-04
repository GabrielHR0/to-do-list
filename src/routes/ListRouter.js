const express = require('express');
const ListController = require('../controllers/ListController');
const router = express.Router();

router.post('/create', ListController.create);
router.post('/add', ListController.addTask);
router.post('/remove', ListController.removeTask);
router.get('/delete/:taskListId', ListController.deleteList);
router.post('/rename', ListController.renameList);
router.get('/:taskListId', ListController.getList);
router.get('/fetch/:taskListId', ListController.fetchTasks);

module.exports = router;