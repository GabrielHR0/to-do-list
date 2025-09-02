const ObjectControl = require('../database/objectControl');

class UserController extends ObjectControl {
    constructor(){
        super('users'); 
    }

    async create(data){
        return await super.create(data);
    }

    async findById(id){
        return await super.find({id});
    }
}

module.exports = new UserController();