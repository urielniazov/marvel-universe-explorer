CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actor_movie (
    actor_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    PRIMARY KEY (actor_id, movie_id),
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS character_actor (
    character_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    PRIMARY KEY (character_id, actor_id, movie_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Jobs table for tracking scraping jobs
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,               -- UUID correlation ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK (status IN ('in_progress', 'success', 'error')) NOT NULL,
    error_message TEXT DEFAULT NULL    -- Stores error message if any
);