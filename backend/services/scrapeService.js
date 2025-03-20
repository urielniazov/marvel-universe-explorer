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

    async _startScrapingJobBackground(correlationId) {
        try {
            console.log('Starting scraping job in the background...');

            const allMovies = await tmdbService.fetchAllMarvelMovies();
            // Fetch data from tmdbService
            const { movies, actors, characters, actorMovies, characterActors } = await tmdbService.fetchAllMarvelData(allMovies);

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
