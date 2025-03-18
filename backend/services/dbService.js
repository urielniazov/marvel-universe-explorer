import sqlite3 from 'sqlite3';

class DbService {
    constructor(dbFileName = 'marvel-universe.db') {
        this.dbFileName = dbFileName
    }

    // Run SQL queries that modify the database (e.g., INSERT, UPDATE, DELETE)
    async runQuery(query, params = []) {
        const db = await this.openConnection();
        try {
            await db.run(query, params);
        } catch (error) {
            console.error('Error running query:', error);
            throw error;
        }
    }

    // // Get a single result for SELECT queries
    // getQuery(query, params = [], callback = () => { }) {
    //     this.db.get(query, params, (err, row) => {
    //         if (err) {
    //             console.error('Error running query:', err.message);
    //             callback(err, null);
    //         } else {
    //             console.log('Query result:', row);
    //             callback(null, row);
    //         }
    //     });
    // }

    // // Get multiple results for SELECT queries
    // allQuery(query, params = [], callback = () => { }) {
    //     this.db.all(query, params, (err, rows) => {
    //         if (err) {
    //             console.error('Error running query:', err.message);
    //             callback(err, null);
    //         } else {
    //             console.log('Query result:', rows);
    //             callback(null, rows);
    //         }
    //     });
    // }

    // // Insert a movie into the movies table
    // insertMovie(title, callback) {
    //     const sql = 'INSERT INTO movies (title) VALUES (?)';
    //     this.runQuery(sql, [title], callback);
    // }

    // // Insert an actor into the actors table
    // insertActor(fullName, callback) {
    //     const sql = 'INSERT INTO actors (full_name) VALUES (?)';
    //     this.runQuery(sql, [fullName], callback);
    // }

    // // Insert a character into the characters table
    // insertCharacter(fullName, callback) {
    //     const sql = 'INSERT INTO characters (full_name) VALUES (?)';
    //     this.runQuery(sql, [fullName], callback);
    // }

    // // Insert a movie-actor relationship
    // insertActorMovie(actorId, movieId, callback) {
    //     const sql = 'INSERT INTO actor_movie (actor_id, movie_id) VALUES (?, ?)';
    //     this.runQuery(sql, [actorId, movieId], callback);
    // }

    // // Insert a character-actor relationship
    // insertCharacterActor(characterId, actorId, movieId, callback) {
    //     const sql = 'INSERT INTO character_actor (character_id, actor_id, movie_id) VALUES (?, ?, ?)';
    //     this.runQuery(sql, [characterId, actorId, movieId], callback);
    // }

    async insertJob(id, status) {
        const query = `INSERT INTO jobs (id, status) VALUES (?, ?)`;
        await this.runQuery(query, [id, status]);
    }

    async updateJobStatus(id, status, errorMessage = null) {
        const query = `UPDATE jobs SET status = ?, error_message = ? WHERE id = ?`;
        await this.runQuery(query, [status, errorMessage, id]);
    }

    async openConnection() {
        if (!this.db) {
            this.db = new sqlite3.Database(this.dbFileName, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                } else {
                    console.log('Connected to the marvel-universe database.');
                }
            });
        }
        return this.db;
    }
    
    async closeConnection() {
        if (this.db) {
            await this.db.close();
            console.log('Database connection closed.');
            this.db = null;
        }
    }
}

export default DbService;
