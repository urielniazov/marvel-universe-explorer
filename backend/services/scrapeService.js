import { tmdbService } from './tmdbService.js';
import DbService from './dbService.js';
class ScrapeService {
    constructor() {
        this.dbService = new DbService();  // Initialize DbService
    }
    async startScrapingJob() {
        const correlationId = crypto.randomUUID();

        console.log('started working in the service');

        await this.dbService.insertJob(correlationId, 'in_progress');

        setTimeout(() => {
            this._startScrapingJobBackground(correlationId);
        }, 0);

        await this.dbService.closeConnection();

        return correlationId;
    }

    async getMissingMovies(movies) {
        if (!movies || movies.length === 0) {
            return [];
        }
        const movieTitles = movies.map(movie => movie.title);
        const placeholders = movieTitles.map(() => '?').join(',');
        const query = `SELECT title FROM movies WHERE title IN (${placeholders})`;

        await this.dbService.openConnection();
        const existingMovies = await this.dbService.dbPromise(query, movieTitles);
        await this.dbService.closeConnection();

        // Extract existing movie titles from DB
        const existingTitles = new Set(existingMovies.map(row => row.title));

        const missing = movies.filter(movie => !existingTitles.has(movie.title));

        return missing;
    }

    async _startScrapingJobBackground(correlationId) {
        try {
            console.log('Starting scraping job in the background...');

            const lastestJobSuccess = await this.dbService.getLatestJobSuccess();
            var lastJobCreatedAt = null;
            if (lastestJobSuccess?.length === 1) {
                lastJobCreatedAt = lastestJobSuccess[0].created_at;
            }
            var newMovies = await tmdbService.fetchAllMarvelMovies(lastJobCreatedAt);
            if (lastJobCreatedAt) {
                var newMovies = await this.getMissingMovies(newMovies);
            }
            // Fetch data from tmdbService
            const { movies, actors, characters, actorMovies, characterActors } = await tmdbService.fetchAllMarvelData(newMovies);

            if (movies.length === 0) {
                console.log('No new movies to process');
                return;
            }
            // Insert all data into the database efficiently
            const result = await this.dbService.insertAllData(movies, actors, characters, actorMovies, characterActors);

            // Update job status
            await this.dbService.updateJobStatus(correlationId, 'success');
            console.log('Data insertion completed:', result);

        } catch (error) {
            console.error('Error during scraping job:', error);
            await this.dbService.updateJobStatus(correlationId, 'error', error.message);
        }
        finally {
            await this.dbService.closeConnection();
        }
    }
}

export const scrapeService = new ScrapeService();
