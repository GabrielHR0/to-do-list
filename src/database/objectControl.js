const DataControl = require('./dataControl');

class Model {

    static table = null;

    static async find(conditions = {}, orderBy, projection = ['*']){
        return await DataControl.find(this.table, conditions, orderBy, projection);
    }

    static async findOne(conditions = {}, projection = ['*']){
        return await DataControl.findOne(this.table, conditions, projection);
    }

    static async findAll(projection, orderBy = null) {
        return await DataControl.findAll(this.table, projection, orderBy);
    }

    static async findById(conditions, projection=['*']){
        return await DataControl.findOne(this.table, conditions, projection);
    }

    static async create(data = {}){
        return await DataControl.create(this.table, data);
    }

    static async delete(conditions){
        return await DataControl.delete(this.table, conditions)
    }

    static async update(conditions, data = {}){
        return await DataControl.update(this.table, conditions, data)
    }
}

module.exports = Model;