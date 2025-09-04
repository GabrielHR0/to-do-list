const List = require('../models/TaskList');
const Task = require('../models/Task');
const TaskOrder = require('../models/TaskOrder');
const TaskController = require('./TaskController');
const TaskList = require('../models/TaskList');
const taskOrder = require('../models/TaskOrder');

const ListController = {

    async create(req, res){
        try {
            const { title, userId } = req.body;
            const list = new List(title, userId);
            const result = await TaskList.create(list);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async fetchTasks(req, res){
        try {
            const { taskListId } = req.params
            const order = await TaskOrder.find({ taskListId });
            const tasks = []
            for (const tuple of order){
                tasks.push(await Task.findOne({ id: tuple.taskId }));
            }
            res.status(200).json(tasks);
        } catch (error){
            res.status(500).json({error: error.message});
        }
    },

    async addTask(req, res){
        try {
            const result = await TaskController.createTask(req);
            console.log("Task created:", result);
            const { taskListId } = req.body;
            if (!TaskList.findById({id: taskListId})){
                return res.status(404).json({error: "Task list not found"});
            }

            const lastTask = await TaskOrder.find(
                { taskListId },
                'position DESC',
                ['position']
            );

            const step = 1;

            const position = lastTask.length > 0 ? lastTask[0].position + step : step;
            const taskOrder = new TaskOrder({taskListId, taskId:result.id, position});
            await TaskOrder.create(taskOrder);

            console.log("Last task order:", lastTask);

            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async removeTask(req, res){
        try {
            const { taskListId, taskId } = req.body;
            const listOrder = await TaskOrder.find({taskListId}, );

            const nextTasks = await orderStartingFrom(listOrder, taskId)
            const taskOrder = nextTasks[0];
            
            await reOrdenate(nextTasks);
           
            if (taskOrder.taskId != taskId){
                return res.status(404).json({error: "Task not found in the list"});
            }

            await TaskOrder.delete({taskListId, taskId, position: taskOrder.position});
            await TaskController.deteleTask(req);
            res.status(200).json({message: "Task removed from the list"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async switchTaskOrder(req, res){
        const { firstTask,  secondTask, taskListId } = req.body;
        const firstOrder = await taskOrder.findOne({taskId: firstTask, taskListId},[position]);
        const secondOrder = await taskOrder.findOne({taskId: secondTask, taskListId}, [position]);

        console.log("first, second:", firstOrder, secondOrder);
        if(!firstOrder || !secondOrder){
            return res.status(404).json({message: "Tasks not found"});
        }

        TaskOrder.update({taskId: firstTask, taskListId}, {position: secondOrder.position});
        TaskOrder.update({taskId: secondTask, taskListId}, {position: firstOrder.position});
    },

    async deleteList(req, res) {
        try {
            const { taskListId } = req.params;
            
            const list = await TaskList.findById({id: taskListId});
            if (!list) {
                return res.status(404).json({ error: "Task list not found" });
            }

            const tasks = await TaskOrder.find({ taskListId }, 'position ASC', ['taskId', 'position']);

            for (const t of tasks) {
                await TaskOrder.delete({ taskListId, taskId: t.taskId, position: t.position });
                await Task.delete({ id: t.taskId }); // ou TaskController.deleteTask({ id: t.taskId }) se usar controller
            }

            await TaskList.delete({ id: taskListId });

            res.status(200).json({ message: "Task list and all tasks removed successfully" });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async renameList(req, res){
        try {
            const { taskListId, title } = req.body;

            const list = await TaskList.findById({id: taskListId});
            if (!list) {
                return res.status(404).json({ error: "Task list not found" });
            }

            TaskList.update({id: list.id}, {title: title});
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async getList(req, res){
        try{
            const { taskListId } = req.params;
            const list = await TaskList.findById({id: taskListId});
            if (!list) {
                return res.status(404).json({ error: "Task list not found" });
            }
            res.status(200).json(list);
        } catch (error){
            res.status(500).json({error: error.message});
        }
    }
    
};

async function orderStartingFrom(listOrder, taskId){

        let taskOrder;
        const collected = []
        let startCollecting = false;

        for (const element of listOrder) {
            if (!startCollecting && element.taskId === taskId) {
                startCollecting = true; 
            }

            if (startCollecting) {
                collected.push(element);
            }
        }

        return collected;
    }

    async function reOrdenate(listOrder){
        for (let index = 1; index < listOrder.length; index++) {
            const current = listOrder[index];
            const nextPosition = listOrder[index - 1].position;

            await TaskOrder.update({taskListId: current.taskListId, taskId: current.taskId,}, {position: nextPosition});
        }
    }

module.exports = ListController;