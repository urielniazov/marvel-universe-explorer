import { scrapeService } from '../services/scrapeService.js';

// // Controller to start the scraping job
// export const startScraping = async (req, res) => {
//     try {
//         // Call the service to start the scraping process asynchronously
//         const correlationId = await scrapeService.startScrapingJob(correlationId);

//         // Respond immediately with the correlation ID to track job status
//         res.status(202).json({ message: 'Scraping started', correlationId });
//     } catch (error) {
//         console.error('Error occurred during scraping:', error);
//         res.status(500).send('Error occurred while starting the scraping process.');
//     }
// };

// Controller to start the scraping job
export const startScraping = async (req, res) => {
    console.log('called api');
    try {
        // Call the service to start the scraping process asynchronously
        const correlationId = await scrapeService.startScrapingJob();

        // Respond immediately with the correlation ID to track job status
        res.status(202).json({ message: 'Scraping started', correlationId });
    } catch (error) {
        console.error('Error occurred during scraping:', error);
        res.status(500).send('Error occurred while starting the scraping process.');
    }
};


// Controller to check the status of the job
export const getJobStatus = async (req, res) => {
    const { correlationId } = req.params;
    try {
        const status = await scrapeService.getJobStatus(correlationId);
        if (status) {
            res.json({ correlationId, status });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error checking job status:', error);
        res.status(500).send('Error occurred while checking job status.');
    }
};
