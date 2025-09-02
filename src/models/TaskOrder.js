const ObjectControl = require('../database/objectControl');

class taskOrder extends ObjectControl{

    constructor(taskListId, taskId, position) {
        super('taskOrders')
        this.taskListId = taskListId;
        this.taskId = taskId;
        this.position = position;
    }

    async create(data){
        return await super.create(data);
    }

}

module.exports = taskOrder;