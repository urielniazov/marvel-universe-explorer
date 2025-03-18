// src/routes/marvelRoutes.js
import express from 'express';
import { getMoviesPerActor, getActorsWithMultipleCharacters, getCharactersWithMultipleActors } from '../controllers/marvelController.js';

const router = express.Router();

// Movies Per Actor Endpoint
router.get('/moviesPerActor', getMoviesPerActor);

// Actors with Multiple Characters Endpoint
router.get('/actorsWithMultipleCharacters', getActorsWithMultipleCharacters);

// Characters with Multiple Actors Endpoint
router.get('/charactersWithMultipleActors', getCharactersWithMultipleActors);

export default router;
