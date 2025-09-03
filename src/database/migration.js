const db = require('../config/database');
const schema = require('../database/schema.json');

async function initDatabase(db, schema) {
    for (const [table, tableDef] of Object.entries(schema)) {
        const cols = Object.entries(tableDef.columns)
            .map(([name, type]) => `${name} ${type}`)
            .join(', ');

        let constraints = [];

        if (tableDef.primaryKey) {
            constraints.push(`PRIMARY KEY (${tableDef.primaryKey.join(', ')})`);
        }

        if (tableDef.foreignKeys) {
            for (const fk of tableDef.foreignKeys) {
                constraints.push(`FOREIGN KEY (${fk.column}) REFERENCES ${fk.references}`);
            }
        }
        const ddl = `CREATE TABLE IF NOT EXISTS ${table} (${cols}${constraints.length ? ', ' + constraints.join(', ') : ''})`;
        await db.run(ddl);
        console.log(`Tabela "${table}" criada ou já existe.`);
    }
}


(async () =>{
    await initDatabase(db, schema);
})();