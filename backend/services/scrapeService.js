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

        // setTimeout(() => {
        //     this._startScrapingJobBackground(correlationId);
        // }, 0);

        return correlationId;
    }

    async _startScrapingJobBackground() {
        try {
            const { movies, actors, characters } = await tmdbService.fetchAllMarvelData();

            // Insert data into DB (e.g., movies, actors, characters)
            // await this._storeDataInDB(movies, actors, characters);

        } catch (error) {
            console.error('Scraping failed:', error);


        }
    }
}

export const scrapeService = new ScrapeService();
