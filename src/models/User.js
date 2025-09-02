const ObjectControl = require('../database/objectControl');

class User extends ObjectControl{
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }
}

module.exports = User;
