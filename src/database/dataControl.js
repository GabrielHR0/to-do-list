const db = require('../config/database');

class DataControl{

    async find(table, conditions = {}, orderBy = 'id DESC', projection = ['*']){

        let whereCLause = '';
        let params = [];

        if (Object.keys(conditions).length > 0){
            whereCLause = 'WHERE ' + Object.keys(conditions)
            .map(key => `${key} = ?`)
            .join(' AND ');
            params = Object.values(conditions);
        }

        const columns = projection.length > 1 ? projection.join(', ') : projection[0] || '*';
        const dml = `SELECT ${columns} FROM ${table} ${whereCLause} ORDER BY ${orderBy}`;

        return await db.all(dml, params);
    }

    async findOne(table, conditions = {}, projection = ['*']){

        let whereCLause = '';

        if (Object.keys(conditions).length > 0){
            whereCLause = 'WHERE ' + Object.keys(conditions)
            .map(key => `${key} = ?`)
            .join(' AND ');
        }

        const params = Object.values(conditions);

        const columns = projection.length > 1 ? projection.join(', ') : projection[0] || '*';
        const dml = `SELECT ${columns} FROM ${table} ${whereCLause}`;

        return await db.get(dml, params);
    }

    async findById(table, id, projection=['*']){
        const columns = projection.length > 1 ? projection.join(', ') : projection[0] || '*';
        const dml = `SELECT ${columns} FROM ${table} WHERE id = ?`;
        return await db.get(dml, [id]);
    }

    async create(table, data){
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeHolders = keys.map(() => `?`).join(', ');

        const dml = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeHolders})`;
        const result = await db.run(dml, values);

        return { ...data };
    }

    async delete(table, id){
        await db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
        return true;
    }

    async update(table, id, data = {}){
        const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
        
        const values = [ ...Object.values(data), id];

        const dml = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
        await db.run(dml, values)

        return this.findById(table, id);
    }

}

module.exports = new DataControl();
