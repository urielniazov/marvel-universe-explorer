// src/controllers/marvelController.js
import MarvelService from '../services/marvelService.js';

// Instantiate the MarvelService class
const marvelService = new MarvelService();

export const getMoviesPerActor = async (req, res) => {
  try {
    const data = await marvelService.fetchMoviesPerActor();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

export const getActorsWithMultipleCharacters = async (req, res) => {
  try {
    const data = await marvelService.fetchActorsWithMultipleCharacters();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

export const getCharactersWithMultipleActors = async (req, res) => {
  try {
    const data = await marvelService.fetchCharactersWithMultipleActors();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};
