const ObjectControl = require('../database/objectControl');

class User extends ObjectControl{
  
  static table = 'users';

  constructor(id, email, password) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
  }
}

module.exports = User;
