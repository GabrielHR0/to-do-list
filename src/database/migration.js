const db = require('../config/database');
const schema = require('../database/schema.json');

async function initDatabase(db, schema) {
    for (const [table, columns] of Object.entries(schema)) {
        const cols = Object.entries(columns)
        .map(([name, meta]) => `${name} ${meta}`)
        .join(', ');

        const ddl = `CREATE TABLE IF NOT EXISTS ${table} (${cols})`;
        await db.run(ddl);
        console.log(`Tabela "${table}" criada ou já existe.`);
    }
}

(async () =>{
    await initDatabase(db, schema);
})();