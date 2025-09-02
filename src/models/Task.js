const ObjectControl = require('../database/objectControl');

class Task extends ObjectControl{

  constructor(id, title, description, status, dueDate, endDate, taskListId) {
    super('tasks')
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.endDate = endDate;
    this.taskListId = taskListId;
  }

  async create(data){
    return await super.create(data);
  }

}

module.exports = Task;
