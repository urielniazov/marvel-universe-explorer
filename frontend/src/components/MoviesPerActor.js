import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import movieStore from '../stores/MovieStore';

const MoviesPerActor = observer(() => {
  const [selectedActor, setSelectedActor] = useState('');

  useEffect(() => {
    movieStore.fetchMoviesPerActor();
  }, []);

  const actors = Object.keys(movieStore.moviesPerActor);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Movies Per Actor</h2>
      
      {movieStore.loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="actor-select" className="block mb-2">Select an Actor:</label>
            <select
              id="actor-select"
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an actor</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>

          {selectedActor && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">
                Movies for {selectedActor}:
              </h3>
              <ul className="list-disc pl-5">
                {movieStore.moviesPerActor[selectedActor]?.map((movie) => (
                  <li key={movie}>{movie}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default MoviesPerActor;