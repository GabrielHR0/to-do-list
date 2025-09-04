const ObjectControl = require('../database/objectControl');
class Step extends ObjectControl {

  static table = 'step';

  constructor(title, status, taskId) {
    super();
    this.id;
    this.title = title;
    this.status = status;
    this.taskId = taskId;
  }
}

module.exports = Step;
