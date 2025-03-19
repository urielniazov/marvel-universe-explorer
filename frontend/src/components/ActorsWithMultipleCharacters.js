import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import movieStore from '../stores/MovieStore';

const ActorsWithMultipleCharacters = observer(() => {
  useEffect(() => {
    movieStore.fetchActorsWithMultipleCharacters();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Actors with Multiple Characters</h2>
      
      {movieStore.loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {Object.entries(movieStore.actorsWithMultipleCharacters).map(([actor, characters]) => (
            <div key={actor} className="mb-6 p-4 border rounded">
              <h3 className="text-xl font-semibold mb-2">{actor}</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Movie</th>
                    <th className="p-2 text-left">Character</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((char, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{char.movieName}</td>
                      <td className="p-2">{char.characterName}</td>
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

export default ActorsWithMultipleCharacters;