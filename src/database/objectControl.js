const DataControl = require('./dataControl');

class Model {

    static table = null;

    static async find(conditions = {}, orderBy = 'id DESC', projection = ['*']){
        return await DataControl.find(this.table, conditions, orderBy, projection);
    }

    static async findOne(conditions = {}, projection = ['*']){
        return await DataControl.findOne(this.table, conditions, projection);
    }

    static async findById(id, projection=['*']){
        return await DataControl.findOne(this.table, id, projection);
    }

    static async create(data = {}){
        return await DataControl.create(this.table, data);
    }

    static async delete(id){
        return await DataControl.delete(this.table, id)
    }

    static async update(id, data = {}){
        return await DataControl.update(this.table, id, data)
    }
}

module.exports = Model;