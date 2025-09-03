const ObjectControl = require('../database/objectControl');

class taskOrder extends ObjectControl{

    constructor(taskListId, position = 0) {
        super();
        this.taskListId = taskListId;
        this.taskId;
        this.position = position;
    }

    async concatenate(){
        this.position += 1
    }

}

module.exports = taskOrder;