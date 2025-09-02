const ObjectControl = require('../database/objectControl');

class TaskList extends ObjectControl{

  constructor(id, title, userId) {
    super('tasksLists')
    this.id = id;
    this.title = title;
    this.userId = userId;
  }

  async create(data){
    return await super.create(data);
  }

}

module.exports = TaskList;
