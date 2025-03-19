// src/services/marvelService.js
import DbService from './dbService.js';  // Import the DbService to interact with DB

class MarvelService {
  constructor(db) {
    this.dbService = new DbService(db);  // Initialize DbService with database connection
  }

  // Fetch movies per actor
  async fetchMoviesPerActor() {
    let result = {};
    try {
      // Open DB connection
      await this.dbService.openConnection();

      // Fetch data
      const rows = await this.dbService.fetchMoviesPerActor();

      // Transform the data into an object with actor names as keys and movie names as values
      result = rows.reduce((acc, row) => {
        acc[row.actorName] = row.movieNames.split(',');
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching movies per actor:', error);
      throw new Error('Error fetching movies per actor');
    } finally {
      // Close DB connection
      await this.dbService.closeConnection();
    }
    return result;
  }

  // Fetch actors with multiple characters
  async fetchActorsWithMultipleCharacters() {
    let result = {};
    try {
      // Open DB connection
      await this.dbService.openConnection();

      // Fetch data
      const rows = await this.dbService.fetchActorsWithMultipleCharacters();

      // Transform the data into an object with actor names as keys and an array of movie-character pairs as values
      result = rows.reduce((acc, row) => {
        if (!acc[row.actorName]) {
          acc[row.actorName] = [];
        }
        acc[row.actorName].push({
          movieName: row.movieName,
          characterName: row.characterName
        });
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching actors with multiple characters:', error);
      throw new Error('Error fetching actors with multiple characters');
    } finally {
      // Close DB connection
      await this.dbService.closeConnection();
    }
    return result;
  }

  // Fetch characters with multiple actors
  async fetchCharactersWithMultipleActors() {
    let result = {};
    try {
      // Open DB connection
      await this.dbService.openConnection();
  
      // Fetch data
      const rows = await this.dbService.fetchCharactersWithMultipleActors();
  
      // Validate rows
      if (!rows || rows.length === 0) {
        console.warn('No characters with multiple actors found');
        return {};
      }
  
      // Transform the data into an object with character names as keys 
      // and an array of movie-actor pairs as values
      result = rows.reduce((acc, row) => {
        // Skip empty or invalid rows
        if (!row || !row.characterName || !row.characterName.trim()) return acc;
  
        // Initialize character entry if not exists
        if (!acc[row.characterName]) {
          acc[row.characterName] = [];
        }
  
        // Add movie-actor pair, avoiding duplicates
        const movieActorPair = {
          movieName: row.movieName || '',
          actorName: row.actorName || ''
        };
  
        // Check if this exact movie-actor pair already exists
        const isDuplicate = acc[row.characterName].some(
          existing => 
            existing.movieName === movieActorPair.movieName && 
            existing.actorName === movieActorPair.actorName
        );
  
        if (!isDuplicate) {
          acc[row.characterName].push(movieActorPair);
        }
  
        return acc;
      }, {});
  
      // Optional: Filter out characters with only one actor (additional safety)
      result = Object.fromEntries(
        Object.entries(result).filter(([_, actors]) => actors.length > 1)
      );
  
    } catch (error) {
      console.error('Error fetching characters with multiple actors:', error);
      throw new Error('Error fetching characters with multiple actors');
    } finally {
      // Close DB connection
      await this.dbService.closeConnection();
    }
  
    return result;
  }
}

export default MarvelService;
