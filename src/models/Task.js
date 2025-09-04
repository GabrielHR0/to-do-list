const ObjectControl = require('../database/objectControl');

class Task extends ObjectControl{

  static table = 'tasks';

  constructor(id, title, description, status, dueDate, endDate, taskListId) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = ['pending, completed, orverdue, canceled'].includes(status) ? status : 'pending';
    this.dueDate = dueDate;
    this.endDate = endDate;
    this.taskListId = taskListId;
  }

  setStatus(status = 'pending'){
    this.status = status
  }

  setEndDate(endDate = null){
    this.endDate = endDate
  }


}

module.exports = Task;
