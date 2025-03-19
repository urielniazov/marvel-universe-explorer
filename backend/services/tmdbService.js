import { COMPANIES, GENRES } from '../constants.js';
import { rateLimitService } from './rateLimitService.js';

class TMDBService {
    constructor() {
        this.companyIds = Object.values(COMPANIES).join('|');
        this.genreIds = Object.values(GENRES).join('|');
    }

    buildQuery(params = {}) {
        const defaultParams = {
            include_adult: false,
            include_video: false,
            language: 'en-US',
            with_companies: this.companyIds,
            with_genres: this.genreIds,
            ...params // Merge with additional filters
        };

        const queryString = new URLSearchParams(defaultParams).toString();
        return `/discover/movie?${queryString}`;
    }

    async fetchMarvelMoviesFirstPage() {
        const query = this.buildQuery({ page: 1 });
        return await rateLimitService.fetchWithRateLimit(query);
    }

    async fetchAllMarvelMovies() {
        const firstPageData = await this.fetchMarvelMoviesFirstPage();
        const totalPages = firstPageData.total_pages;

        let allMovies = firstPageData.results.map(({ title, id }) => ({
            title,
            id
        }));

        if (totalPages > 1) {
            const movieFetchPromises = [];
            for (let page = 2; page <= totalPages; page++) {
                const query = this.buildQuery({ page });
                movieFetchPromises.push(
                    rateLimitService.fetchWithRateLimit(query)
                );
            }

            const remainingPagesData = await Promise.all(movieFetchPromises);

            remainingPagesData.forEach((page) => {
                allMovies.push(...page.results.map(({ title, id }) => ({ title, id })));
            });
        }
       
        return allMovies;
    }

    async fetchMovieCredits(movieId) {
        const data = await rateLimitService.fetchWithRateLimit(
            `/movie/${movieId}/credits?language=en-US`
        );
        return data.cast.map(({ name, character }) => ({
            name,
            character,
        }));
    }

    async fetchAllMarvelData() {
        // Fetch all movies
        const movies = await this.fetchAllMarvelMovies();
        console.log(`Fetched ${movies.length} Marvel movies`);
        
        // Fetch all credits in parallel
        const creditPromises = movies.map((movie) => 
            this.fetchMovieCredits(movie.id).then(credits => ({
                movie,
                credits
            }))
        );
    
        const allMovieCredits = await Promise.all(creditPromises);
    
        // Prepare data structures
        const formattedMovies = movies.map(movie => ({ title: movie.title }));
        
        // Use Set to track unique actors
        const actorsSet = new Set();
        const actorMovies = [];
        const characterActors = [];
        
        // Process credits
        allMovieCredits.forEach(({ movie, credits }) => {
            credits.forEach(({ name, character }) => {
                // Add actor to unique set
                actorsSet.add(name);
                
                // Add actor-movie relation
                actorMovies.push({
                    actorName: name,
                    movieTitle: movie.title
                });
                
                // Add character-actor relation
                characterActors.push({
                    characterName: character,
                    actorName: name,
                    movieTitle: movie.title
                });
            });
        });
        
        // Get unique characters
        const charactersSet = new Set(characterActors.map(ca => ca.characterName));
        
        // Format final data
        const formattedActors = Array.from(actorsSet).map(name => ({ full_name: name }));
        const formattedCharacters = Array.from(charactersSet).map(name => ({ full_name: name }));
        
        console.log(`Processed data:
        - ${formattedMovies.length} movies
        - ${formattedActors.length} unique actors
        - ${formattedCharacters.length} unique characters
        - ${actorMovies.length} actor-movie relations
        - ${characterActors.length} character-actor relations`);
        
        return {
            movies: formattedMovies,
            actors: formattedActors,
            characters: formattedCharacters,
            actorMovies,
            characterActors
        };
    }
}

export const tmdbService = new TMDBService();
