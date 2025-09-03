const List = require('../models/TaskList');
const Task = require('../models/Task');
const TaskOrder = require('../models/TaskOrder');
const TaskController = require('./TaskController');
const TaskList = require('../models/TaskList');

const ListController = {

    async create(req, res){
        try {
            const { title, userId } = req.body;
            const list = new List(title, userId);
            const result = await Task.create(list);
            const taskOrder = new TaskOrder(result.id);
            await TaskOrder.create(taskOrder);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async fetchTasks(req, res){
        try {
            const { taskListId } = req.params
            const tasks = await Task.find({taskListId});
            res.status(200).json(tasks);
        } catch (error){
            res.status(500).json({error: message.error});
        }
    },

    async addTask(req, res){
        try {
            const result = await TaskController.createTask(req);
            const { taskListId } = req.body;
            const taskOrder = await TaskOrder.findOne({taskListId, taskId: result.id});
            
        } catch (error) {
            
        }
    }
    
};

module.exports = ListController;