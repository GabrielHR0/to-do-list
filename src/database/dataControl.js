const db = require('../config/database');

class DataControl{

    async find(table, conditions = {}, orderBy = null, projection = ['*']){

        let whereCLause = '';
        let params = [];

        if (Object.keys(conditions).length > 0){
            whereCLause = 'WHERE ' + Object.keys(conditions)
            .map(key => `${key} = ?`)
            .join(' AND ');
            params = Object.values(conditions);
        }

        const columns = projection.length > 1 ? projection.join(', ') : projection[0] || '*';
        
        const ordered = `SELECT ${columns} FROM ${table} ${whereCLause} ORDER BY ${orderBy}`;
        const unordered = `SELECT ${columns} FROM ${table} ${whereCLause}`;

        const dml = !!orderBy ? ordered : unordered;

        return await db.allAsync(dml, params);
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

        console.log("FindOne DML:", dml, "\n parameters:", params);

        return await db.getAsync(dml, params);
    }

    async findById(table, id, projection=['*']){
        const columns = projection.length > 1 ? projection.join(', ') : projection[0] || '*';
        const dml = `SELECT ${columns} FROM ${table} WHERE id = ?`;
        return await db.getAsync(dml, [id]);
    }

    async create(table, data){
        const insertData = { ...data };
        if (insertData.id === null || insertData.id === undefined) delete insertData.id;
        const keys = Object.keys(insertData);
        const values = Object.values(insertData);
        const placeHolders = keys.map(() => `?`).join(', ');

        const dml = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeHolders})`;
        console.log("Create DML:", dml);
        const result = await db.runAsync(dml, values);

        return { id: result.lastID, ...insertData };

    }

    async delete(table, conditions = { id }) {
        if (!conditions || Object.keys(conditions).length === 0) {
            throw new Error("É necessário informar pelo menos uma condição para deletar");
        }

        const whereClause = Object.keys(conditions)
            .map(key => `${key} = ?`)
            .join(' AND ');

        const values = Object.values(conditions);
        const dml = `DELETE FROM ${table} WHERE ${whereClause}`;

        await db.runAsync(dml, values);
        return true;
    }


    async update(table, conditions = null, data = {}) {
        if (Object.keys(data).length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        if (!conditions) {
            if (!data.id) throw new Error('Nenhuma condição de update informada e data.id não existe');
            conditions = { id: data.id };
        }

        const setClause = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');

        const whereClause = Object.keys(conditions)
            .map(key => `${key} = ?`)
            .join(' AND ');

        const values = [...Object.values(data), ...Object.values(conditions)];
        const dml = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

        console.log("Update DML:", dml, "\nvalues:", values);

        await db.runAsync(dml, values);

        return { ...conditions, ...data };
    }


}

module.exports = new DataControl();
