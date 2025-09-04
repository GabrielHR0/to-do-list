const ObjectControl = require('../database/objectControl');

class taskOrder extends ObjectControl{

    static table = 'taskOrders';

    constructor(data) {
        super();
        this.taskListId = data.taskListId;
        this.taskId = data.taskId;
        this.position = data.position;
    }

    increment(step){
        this.position += step;
    }

}

module.exports = taskOrder;