import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:3000/api';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// API service with methods for different endpoints
const ApiService = {
  // Fetch movies per actor
  async getMoviesPerActor() {
    try {
      const response = await apiClient.get('/moviesPerActor');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch movies per actor');
    }
  },

  // Fetch actors with multiple characters
  async getActorsWithMultipleCharacters() {
    try {
      const response = await apiClient.get('/actorsWithMultipleCharacters');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch actors with multiple characters');
    }
  },

  // Fetch characters with multiple actors
  async getCharactersWithMultipleActors() {
    try {
      const response = await apiClient.get('/charactersWithMultipleActors');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch characters with multiple actors');
    }
  },

  // Centralized error handling
  handleError(error, customMessage) {
    // Log the error
    console.error(customMessage, error);

    // Determine the error message
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || customMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(customMessage);
    }
  }
};

export default ApiService;