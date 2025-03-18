import express from 'express';
import { startScraping, getJobStatus } from '../controllers/scrapeController.js';

const router = express.Router();

// Define the route to start the scraping process
router.post('/scrape', startScraping);

// Define the route to check the job status
router.get('/scrape/status/:correlationId', getJobStatus);

export default router;
