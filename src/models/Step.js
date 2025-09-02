const ObjectControl = require('../database/objectControl');

class Step extends ObjectControl {
  constructor(id, title, status, taskId) {
    super('steps');
    this.id = id;
    this.title = title;
    this.status = status;
    this.taskId = taskId;
  }
}

module.exports = Step;
