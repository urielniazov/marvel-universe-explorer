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
        const movies = await this.fetchAllMarvelMovies();
        const creditPromises = movies.map((movie) => this.fetchMovieCredits(movie.id));

        const allCredits = await Promise.all(creditPromises);

        let allActors = new Set();
        let allCharacters = [];

        allCredits.forEach((cast, index) => {
            const movie = movies[index];
            cast.forEach(({ name, character }) => {
                allActors.add(name);
                allCharacters.push({
                    actorName: name,
                    characterName: character,
                    movieName: movie.title,
                });
            });
        });

        return {
            movies,
            actors: Array.from(allActors),
            characters: allCharacters,
        };
    }
}

export const tmdbService = new TMDBService();
