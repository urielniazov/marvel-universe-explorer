# Marvel Universe Explorer

This project provides a backend service to interact with movie data, including fetching movie information, actors, characters, and relationships between them, utilizing The Movie Database (TMDb) API. It also supports batch operations for inserting movie, actor, and character data into a SQLite database.

## Features

- Fetch movies, actors, and character data from The Movie Database (TMDb) API.
- Handle rate limiting with automatic retries using an exponential backoff strategy.
- Batch insert movie, actor, and character data into SQLite.
- Provide endpoints to retrieve and manipulate movie, actor, and character information.
- Use of environment variables to securely manage API keys.

## Requirements

- **Node.js**: v14.x or later
- **npm**: v6.x or later
- **SQLite3**: For local database management
- **TMDb API Key**: Required for fetching data from TMDb

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/urielniazov/marvel-universe-explorer.git
   ```
2. Navigate to the project folder:
   `cd marvel-universe-explorer`
   `cd backend`
3. Install dependencies:
   `npm install`
4. Set up your environment file .env to store the TMDb API key:
   `TMDB_API_KEY=your_tmdb_api_key_here`
5. Init sqlite db
   ```bash
   sqlite3 marvel-universe.db < schema.sql
   ```
   ```bash
   sqlite3
   ```
   ```bash
   .open marvel-universe.db
   ```
   ```bash
   .exit
   ```
   If somethign goes wrong just rename the already scraped `backup-marvel-universe.db` to `marvel-universe.db` and let me know!

### API Endpoints

- `GET /api/moviesPerActor` - Returns a list of Marvel movies each actor has appeared in
- `GET /api/actorsWithMultipleCharacters` - Returns actors who have played more than one Marvel character
- `GET /api/charactersWithMultipleActors` - Returns Marvel characters portrayed by multiple actors
- `POST /api/scrape` -  Trigger data synchronization with TMDB

## Database Schema

The project uses SQLite to store movie, actor, character, and job data. Below is an outline of the tables and their relationships.

### Tables

#### `movies`
Stores information about movies.

| Column      | Type        | Description                           |
|-------------|-------------|---------------------------------------|
| `id`        | INTEGER     | Primary key (auto-increment)          |
| `title`     | TEXT        | The title of the movie                |

#### `actors`
Stores information about actors.

| Column      | Type        | Description                           |
|-------------|-------------|---------------------------------------|
| `id`        | INTEGER     | Primary key (auto-increment)          |
| `full_name` | TEXT        | The full name of the actor            |

#### `characters`
Stores information about characters.

| Column      | Type        | Description                           |
|-------------|-------------|---------------------------------------|
| `id`        | INTEGER     | Primary key (auto-increment)          |
| `full_name` | TEXT        | The full name of the character        |

#### `actor_movie`
Stores the many-to-many relationship between actors and movies.

| Column      | Type        | Description                           |
|-------------|-------------|---------------------------------------|
| `actor_id`  | INTEGER     | Foreign key to `actors.id`            |
| `movie_id`  | INTEGER     | Foreign key to `movies.id`            |

**Constraints**:
- Primary key on `(actor_id, movie_id)`
- Foreign key constraints on `actor_id` (references `actors(id)`), and `movie_id` (references `movies(id)`) with `ON DELETE CASCADE`

#### `character_actor`
Stores the many-to-many relationship between characters, actors, and movies.

| Column          | Type        | Description                                 |
|-----------------|-------------|---------------------------------------------|
| `character_id`  | INTEGER     | Foreign key to `characters.id`              |
| `actor_id`      | INTEGER     | Foreign key to `actors.id`                  |
| `movie_id`      | INTEGER     | Foreign key to `movies.id`                  |

**Constraints**:
- Primary key on `(character_id, actor_id, movie_id)`
- Foreign key constraints on `character_id` (references `characters(id)`), `actor_id` (references `actors(id)`), and `movie_id` (references `movies(id)`) with `ON DELETE CASCADE`

#### `jobs`
Stores information about scraping jobs.

| Column         | Type        | Description                                   |
|----------------|-------------|-----------------------------------------------|
| `id`           | TEXT        | UUID correlation ID (Primary key)             |
| `created_at`   | DATETIME    | Timestamp when the job was created            |
| `updated_at`   | DATETIME    | Timestamp when the job was last updated       |
| `status`       | TEXT        | Job status (in_progress, success, error)      |
| `error_message`| TEXT        | Error message if any (nullable)               |

### API Performance Optimization

- **Indexes**: Strategic database indexes for faster queries
- **Rate Limiting**: Batch processing and delays to respect TMDB API limits
- **Error Handling**: Comprehensive error handling for API failures

### Code Structure

The application follows a clean, modular architecture:

- **Services**: Business logic and data processing
- **Controllers**: Request handling and response formatting
- **Routes**: API endpoint definitions

## Assumptions

1. **Limited Dataset**: For the MVP, we're focusing on a subset of Marvel movies as specified in the requirements
2. **Character Identification**: Characters are identified by name, which might cause issues if different characters share the same name
3. **Actor Identification**: Actors are identified by their TMDB ID to avoid name conflicts
4. **Data Fetching Strategy**: Most of the data will be fetched once. Afterward, the latest created_at timestamp from the jobs table will be used to fetch only new movies from TMDB that were created after that timestamp. This will avoid unnecessary repeated fetching of already processed data.

## Known Issues

### Duplicate Data on Multiple Scraping Requests

Currently, if multiple scraping requests are made (e.g., running the scraper again after a job completes), the system may duplicate data in the database. This happens because the TMDB API does not provide an "added date" or any other unique identifier to check whether the data has already been fetched. As a result, if the scraper is called multiple times, it fetches the same set of movies, actors, and characters, and the same data is inserted into the database again.

#### Current Workaround
The scraper does not yet track which movies, actors, and characters have already been added to the database, causing repeated fetches of the same data. This results in duplicate entries for the same movies, actors, characters, and their relationships.

#### Planned Solution
To avoid fetching duplicate data, the scraper will:
1. Track the `created_at` timestamp of the last successful scraping job.
2. On subsequent scrapes, only fetch movies that were released after the `created_at` timestamp of the last scrape.
3. This will reduce unnecessary data fetching, especially for movies that have already been added to the database. However, it may still fetch movies released in the future (e.g., Spider-Man 4 in 2026) if the last scrape was performed today. This ensures that the database is always updated with new content while minimizing duplication.

By using this approach, we ensure that only the most relevant data (new releases) is fetched on each run, improving efficiency without duplicating existing records.

