const ObjectControl = require('../database/objectControl');

class TaskList extends ObjectControl {

  static table = 'taskLists';

  constructor(title, userId) {
    super();
    this.id;
    this.title = title;
    this.userId = userId;
  }

}

module.exports = TaskList;
