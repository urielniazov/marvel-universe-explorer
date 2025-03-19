import express from 'express';
import cors from 'cors';
import marvelRoutes from './routes/marvelRoutes.js';
import scrapeRoutes from './routes/scrapeRoutes.js';
import dotenv from 'dotenv';  // Import dotenv to load environment variables

const app = express();
const port = 3000;
dotenv.config({ path: './.env' });

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use('/api', marvelRoutes);
app.use('/api', scrapeRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
