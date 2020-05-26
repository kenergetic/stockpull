const Database = require('better-sqlite3');

module.exports = {
    
    // TODO: Use symbol
    get: async (symbol) => {
        const db = new Database('./ticker.db');
        const query = await db.prepare(`SELECT * FROM spy`).all();
        return query;
    },
    
    getRecent: async (symbol) => {
        const db = new Database('./ticker.db');
        const query = await db.prepare(`SELECT * FROM spy order by date(date) desc limit 100`).all();
        return query;
    },
    
    // Update the database with new ticker data from the API
    update: async(apiRows, symbol) => {
        
        let db = new Database('./ticker.db');
        
        // -- Drop table -- 
        //db.prepare(`DROP TABLE spy`).run();

        // -- Create table if it doesn't exist -- 
        let query = await db.prepare(`CREATE TABLE IF NOT EXISTS spy (
            name TEXT, 
            date TEXT UNIQUE, 
            open REAL, 
            high REAL, 
            low REAL, 
            close REAL, 
            volume REAL)
        `).run();

        // -- Clear table -- 
        //db.prepare(`DELETE FROM spy`).run();

        // -- Count records before inserting -- 
        query = await db.prepare(`SELECT COUNT(*) FROM spy`).get();
        let totalRows = query['COUNT(*)'];

        // -- Bulk insert, ignoring duplicate dates (text date values) 
        const insert = await db.prepare(`INSERT OR IGNORE INTO 
        spy(name, date, open, high, low, close, volume) 
        VALUES(?, ?, ?, ?, ?, ?, ?) `);

        const insertMany = await db.transaction((x) => {

            for (const row of x) {
                insert.run(
                    row.name,
                    row.date,
                    row.open,
                    row.high,
                    row.low,
                    row.close,
                    row.volume
                );
            }
        });
        await insertMany(apiRows);

        // -- Count new records added -- 
        query = await db.prepare(`SELECT COUNT(*) FROM spy`).get();
        totalRows = query['COUNT(*)'] - totalRows;
        console.log(totalRows + ' records added');

        // -- Select records --
        // query = db.prepare(`SELECT * FROM spy`).all();
        // if (query.length > 0) {
        // }

        // close the database connection
        db.close((err) => {
            if (err) { return console.error(err.message);}
        });
    },
}