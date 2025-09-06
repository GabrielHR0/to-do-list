const Step = require('../models/Step');
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

    async getTask(req, res) {
        try {
            const { taskId } = req.params;
            const task = await Task.findById({id: taskId});
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json(task);
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
        const now = new Date();
        const task = await Task.findById({id: taskId});
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        await Task.update({id: taskId},{status: 'completed', endDate: now.toLocaleDateString('pt-BR')});
        res.status(200).json(task);
    },

    async reOpen(req, res){
        const { taskId } = req.params;
        const task = await Task.findById({id: taskId});
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        await Task.update({id: taskId},{status: 'pending', endDate: null});
        res.status(200).json(task);
    },

    async addStep(req, res){
        const { title , taskId } = req.body;
        
        const task = await Task.findOne({id: taskId});

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        await Step.create({title, taskId, status: 'pending'});
        
    },

    async deleteStep(req, res){
        const { stepId } = req.params;
        const step = await Step.findOne({id: stepId});
        if(!step){
            return res.status(404).json({message: "Step not found"});
        }
        await Step.delete({id: stepId});
        res.status(200).json({message: "Step deleted successfully"});
    },

    async updateStep(req, res){
        const { stepId, title, status } = req.body;
        const step = await Step.findOne({id: stepId});
        if(!step){
            return res.status(404).json({message: "Step not found"});
        }
        await Step.update({id: stepId},{title, status});
        res.status(200).json({message: "Step updated successfully"});
    },

    async fetchSteps(req, res){
        const { taskId } = req.params;
        if(!taskId){
            return res.status(400).json({message: "Task ID is required"});
        }
        const steps = await Step.find({taskId});
        console.log(steps);
        return res.status(200).json(steps);
    },

    async updateTask(req, res){
        const { taskId } = req.params;
        const { title, description, dueDate } = req.body;
        console.log(req.body);
        console.log(taskId);
        if(!title && !description && !dueDate){
            return res.status(400).json({message: "Missing required fields"});
        }
        const task = await Task.findById({id: taskId});
        console.log(task);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        if(title === task.title && description === task.description && dueDate === task.dueDate){
            return res.status(200).json({message: "No changes detected"});
        }
        await Task.update({id: taskId},{title, description, dueDate});
        res.status(200).json({message: "Task updated successfully"});
    },

};

module.exports = TaskController;


