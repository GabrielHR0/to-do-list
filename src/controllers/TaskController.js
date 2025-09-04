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
    },

    async deteleTask(req) {
        try {
            const { taskId } = req.body;
            const task = await Task.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            await Task.delete({id:taskId});
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async finish(req, res){
        const { taskId } = req.params;
        const task = new Task(Task.findById(taskId));
        task.setStatus('completed');
        const now = new Date();
        task.setEndDate(now.toLocaleDateString('pt-BR'));
        res.status(200).json(task);
    },

    async reOpen(req, res){
        const { taskId } = req.params;
        const task = new Task(Task.findById(taskId));
        task.setStatus('pending');
        task.setEndDate( null );
        res.status(200).json(task);
    }
};

module.exports = TaskController;


