import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import movieStore from '../stores/MovieStore';

const CharactersWithMultipleActors = observer(() => {
  useEffect(() => {
    movieStore.fetchCharactersWithMultipleActors();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Characters with Multiple Actors</h2>
      
      {movieStore.loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {Object.entries(movieStore.charactersWithMultipleActors).map(([character, actors]) => (
            <div key={character} className="mb-6 p-4 border rounded">
              <h3 className="text-xl font-semibold mb-2">{character}</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Movie</th>
                    <th className="p-2 text-left">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {actors.map((actor, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{actor.movieName}</td>
                      <td className="p-2">{actor.actorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default CharactersWithMultipleActors;