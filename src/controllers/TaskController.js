const Task = require('../models/Task');
const TaskList = require('../models/TaskList');
const TaskOrder = require('../models/TaskOrder');

const TaskController = {
	async create(req, res) {
		try {
			const { title, description, dueDate, taskListId } = req.body;
            const task = new Task(null, title, description, null, dueDate, null, taskListId);
            const result = await Task.create(task);
            res.status(201).json(result);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},

    async createTask(req) {
        try {
            const { title, description, dueDate, taskListId } = req.body;
            const task = new Task(null, title, description, null, dueDate, null, taskListId);
            const result = await Task.create(task);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = TaskController;


