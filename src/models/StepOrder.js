const ObjectControl = require('../database/objectControl');

class StepOrder extends ObjectControl{

    static table = 'stepOrders';

    constructor(data) {
        super();
        this.taskId = data.taskId;
        this.stepId = data.stepId;
        this.position = data.position;
    }

    increment(increment){
        this.position += increment;
    }

}

module.exports = StepOrder;