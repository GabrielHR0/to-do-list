const DataControl = require('./dataControl');

class Model {

    constructor(tableName) {
        this.table = tableName;
    }

    async find(conditions = {}, orderBy = 'id DESC', projection = ['*']){
        return await DataControl.find(this.table, conditions, orderBy, projection);
    }

    async findOne(conditions = {}, projection = ['*']){
        return await DataControl.findOne(this.table, conditions, projection);
    }

    async findById(id, projection=['*']){
        return await DataControl.findOne(this.table, id, projection);
    }

    async create(data = {}){
        return await DataControl.create(this.table, data);
    }

    async delete(id){
        return await DataControl.delete(this.table, id)
    }

    async update(id, data = {}){
        return await DataControl.update(this.table, id, data)
    }
}

module.exports = Model;