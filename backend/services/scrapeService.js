import { tmdbService } from './tmdbService.js';

class ScrapeService {
    // async startScrapingJob() {
    //     // Store the initial job status in DB (set to 'in-progress')
    //     const myUUID = crypto.randomUUID();

    //     await jobStatusDb.saveJobStatus(correlationId, 'in-progress');

    //     // Trigger the background job (scraping data)
    //     this._startScrapingJobBackground(correlationId);
    // }
    async startScrapingJob() {
        // Generate the correlation ID inside the service
        const correlationId = crypto.randomUUID();
        
        console.log('started working in the service');
        
        setTimeout(() => {
            this._startScrapingJobBackground(correlationId);
        }, 0);

        // Return the correlationId to the controller
        return correlationId;
    }

    async _startScrapingJobBackground() {
        try {
            // Simulate the long-running scraping task
            const { movies, actors, characters } = await tmdbService.fetchAllMarvelData();

            // Insert data into DB (e.g., movies, actors, characters)
            // await this._storeDataInDB(movies, actors, characters);

        } catch (error) {
            console.error('Scraping failed:', error);

           
        }
    }
}

export const scrapeService = new ScrapeService();
