import sqlite3 from 'sqlite3';

class DbService {
    constructor(dbPath = 'marvel-universe.db', batchSize = 500) {
        this.dbPath = dbPath;
        this.db = null;
        this.batchSize = batchSize;
    }

    async runQuery(query, params = []) {
        const db = await this.openConnection();
        try {
            await db.run(query, params);
        } catch (error) {
            console.error('Error running query:', error);
            throw error;
        }
    }

    async insertJob(id, status) {
        const query = `INSERT INTO jobs (id, status) VALUES (?, ?)`;
        await this.runQuery(query, [id, status]);
    }

    async updateJobStatus(id, status, errorMessage = null) {
        const query = `UPDATE jobs 
                       SET status = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP 
                       WHERE id = ?`;
        await this.runQuery(query, [status, errorMessage, id]);
    }

    async openConnection() {
        if (!this.db) {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                } else {
                    console.log('Connected to the marvel-universe database.');
                }
            });

            await this.db.run('PRAGMA synchronous = OFF');
            await this.db.run('PRAGMA journal_mode = MEMORY');
            await this.db.run('PRAGMA temp_store = MEMORY');
            await this.db.run('PRAGMA cache_size = 10000');

            return this.db;
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

    async beginTransaction() {
        await this.db.run('BEGIN TRANSACTION');
    }

    async commitTransaction() {
        await this.db.run('COMMIT');
    }

    async rollbackTransaction() {
        await this.db.run('ROLLBACK');
    }

    // Insert entities in batches
    async insertEntitiesBatched(entities, tableName, nameField) {
        const ids = {};

        // Process in batches
        for (let i = 0; i < entities.length; i += this.batchSize) {
            const batch = entities.slice(i, i + this.batchSize);

            // Prepare a multi-value insert statement (much faster than individual inserts)
            const placeholders = batch.map(() => '(?)').join(',');
            const stmt = await this.db.prepare(
                `INSERT INTO ${tableName} (${nameField}) VALUES ${placeholders}`
            );

            // Extract values for this batch
            const values = batch.map(entity => entity[nameField]);

            // Wrap stmt.run in a Promise to wait for completion
            await new Promise((resolve, reject) => {
                stmt.run(values, function (err) {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return reject(err);  // Reject if error occurs
                    }

                    let currentID = this.lastID - batch.length + 1;  // Start from the first inserted ID in the batch
                    batch.forEach(entity => {
                        ids[entity[nameField]] = currentID;
                        currentID++;  // Increment for the next entity
                    });

                    resolve();  // Resolve the promise once the batch is processed
                });
            });

            await stmt.finalize(); // Finalize the statement after running
        }

        return ids;  // Return the ids after all batches are processed
    }

    async insertRelationsBatched(relations, table, columns, getValues) {
        let count = 0;

        // Process in batches
        for (let i = 0; i < relations.length; i += this.batchSize) {
            const batch = relations.slice(i, i + this.batchSize);
            const validBatch = [];
            const values = [];

            // Prepare values for batch
            for (const relation of batch) {
                const rowValues = getValues(relation);
                if (rowValues.every(v => v !== undefined && v !== null)) {
                    validBatch.push(relation);
                    values.push(...rowValues);
                }
            }

            if (validBatch.length === 0) continue;

            // Create a multi-value insert statement with the right number of placeholders
            const valueSets = validBatch.map(() =>
                `(${columns.map(() => '?').join(',')})`
            ).join(',');

            const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${valueSets}`;
            const stmt = await this.db.prepare(query);

            // Execute the batch insert
            await stmt.run(values);
            await stmt.finalize();

            count += validBatch.length;
        }

        return count;
    }
    async insertMovies(movies) {
        console.time('Insert Movies');
        const result = await this.insertEntitiesBatched(movies, 'movies', 'title');
        console.timeEnd('Insert Movies');
        return result;
    }

    async insertActors(actors) {
        console.time('Insert Actors');
        const result = await this.insertEntitiesBatched(actors, 'actors', 'full_name');
        console.timeEnd('Insert Actors');
        return result;
    }

    async insertCharacters(characters) {
        console.time('Insert Characters');
        const result = await this.insertEntitiesBatched(characters, 'characters', 'full_name');
        console.timeEnd('Insert Characters');
        return result;
    }


    async insertActorMovieRelations(relations, actorIds, movieIds) {
        console.time('Insert Actor-Movie Relations');
        const count = await this.insertRelationsBatched(
            relations,
            'actor_movie',
            ['actor_id', 'movie_id'],
            (relation) => [
                actorIds[relation.actorName],
                movieIds[relation.movieTitle]
            ]
        );
        console.timeEnd('Insert Actor-Movie Relations');
        return count;
    }

    async insertCharacterActorRelations(relations, characterIds, actorIds, movieIds) {
        console.time('Insert Character-Actor Relations');
        const count = await this.insertRelationsBatched(
            relations,
            'character_actor',
            ['character_id', 'actor_id', 'movie_id'],
            (relation) => [
                characterIds[relation.characterName],
                actorIds[relation.actorName],
                movieIds[relation.movieTitle]
            ]
        );
        console.timeEnd('Insert Character-Actor Relations');
        return count;
    }
    async createIndices() {
        // Create indices after data insertion for better performance
        console.time('Create Indices');
        await this.db.run('CREATE INDEX IF NOT EXISTS idx_actor_movie_actor ON actor_movie(actor_id)');
        await this.db.run('CREATE INDEX IF NOT EXISTS idx_actor_movie_movie ON actor_movie(movie_id)');
        await this.db.run('CREATE INDEX IF NOT EXISTS idx_character_actor_character ON character_actor(character_id)');
        await this.db.run('CREATE INDEX IF NOT EXISTS idx_character_actor_actor ON character_actor(actor_id)');
        await this.db.run('CREATE INDEX IF NOT EXISTS idx_character_actor_movie ON character_actor(movie_id)');
        console.timeEnd('Create Indices');
    }

    async insertAllData(movies, actors, characters, actorMovies, characterActors) {
        console.time('Total Insertion Time');
        try {
            await this.openConnection();
            await this.beginTransaction();

            // Insert primary entities
            const movieIds = await this.insertMovies(movies);
            console.log(`Inserted ${Object.keys(movieIds).length} movies`);

            const actorIds = await this.insertActors(actors);
            console.log(`Inserted ${Object.keys(actorIds).length} actors`);

            const characterIds = await this.insertCharacters(characters);
            console.log(`Inserted ${Object.keys(characterIds).length} characters`);

            // Insert relationships
            const actorMovieCount = await this.insertActorMovieRelations(actorMovies, actorIds, movieIds);
            console.log(`Inserted ${actorMovieCount} actor-movie relations`);

            const characterActorCount = await this.insertCharacterActorRelations(
                characterActors, characterIds, actorIds, movieIds
            );
            console.log(`Inserted ${characterActorCount} character-actor relations`);

            // Create indices after data is inserted
            await this.createIndices();

            await this.commitTransaction();
            console.timeEnd('Total Insertion Time');

            return {
                moviesInserted: Object.keys(movieIds).length,
                actorsInserted: Object.keys(actorIds).length,
                charactersInserted: Object.keys(characterIds).length,
                actorMovieRelations: actorMovieCount,
                characterActorRelations: characterActorCount
            };
        } catch (error) {
            await this.rollbackTransaction();
            console.error('Error inserting data:', error);
            throw error;
        } finally {
            await this.closeConnection();
        }
    }
}

export default DbService;
