import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

function MarvelMoviesApp() {
  const [activeTab, setActiveTab] = useState('moviesPerActor');
  const [moviesPerActor, setMoviesPerActor] = useState({});
  const [actorsMultipleCharacters, setActorsMultipleCharacters] = useState({});
  const [charactersMultipleActors, setCharactersMultipleActors] = useState({});
  const [selectedActor, setSelectedActor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data for Movies Per Actor
  const fetchMoviesPerActor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/moviesPerActor`);
      setMoviesPerActor(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies per actor');
      setLoading(false);
    }
  };

  // Fetch data for Actors with Multiple Characters
  const fetchActorsMultipleCharacters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/actorsWithMultipleCharacters`);
      setActorsMultipleCharacters(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch actors with multiple characters');
      setLoading(false);
    }
  };

  // Fetch data for Characters with Multiple Actors
  const fetchCharactersMultipleActors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/charactersWithMultipleActors`);
      setCharactersMultipleActors(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch characters with multiple actors');
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    switch(activeTab) {
      case 'moviesPerActor':
        fetchMoviesPerActor();
        break;
      case 'actorsMultipleCharacters':
        fetchActorsMultipleCharacters();
        break;
      case 'charactersMultipleActors':
        fetchCharactersMultipleActors();
        break;
      default:
        break;
    }
  }, [activeTab]);

  // Render Movies Per Actor Tab
  const renderMoviesPerActor = () => {
    const actors = Object.keys(moviesPerActor);

    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Movies Per Actor</h2>
        
        <div className="mb-4">
          <label htmlFor="actor-select" className="block mb-2 font-semibold">
            Select an Actor:
          </label>
          <select
            id="actor-select"
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="w-full p-2 border rounded-md"
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
            <ul className="list-disc pl-5 space-y-1">
              {moviesPerActor[selectedActor].map((movie) => (
                <li key={movie} className="text-gray-700">{movie}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Render Actors with Multiple Characters Tab
  const renderActorsMultipleCharacters = () => {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Actors with Multiple Characters</h2>
        {Object.entries(actorsMultipleCharacters).map(([actor, characters]) => (
          <div key={actor} className="mb-6 p-4 border rounded-lg">
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
    );
  };

  // Render Characters with Multiple Actors Tab
  const renderCharactersMultipleActors = () => {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Characters with Multiple Actors</h2>
        {Object.entries(charactersMultipleActors).map(([character, actors]) => (
          <div key={character} className="mb-6 p-4 border rounded-lg">
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
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-xl p-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center text-xl text-red-500 p-4">{error}</div>;
    }

    switch(activeTab) {
      case 'moviesPerActor':
        return renderMoviesPerActor();
      case 'actorsMultipleCharacters':
        return renderActorsMultipleCharacters();
      case 'charactersMultipleActors':
        return renderCharactersMultipleActors();
      default:
        return renderMoviesPerActor();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Marvel Movies Information
      </h1>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button 
            type="button"
            className={`px-4 py-2 text-sm font-medium border ${
              activeTab === 'moviesPerActor' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            } border-gray-200 rounded-l-lg`}
            onClick={() => setActiveTab('moviesPerActor')}
          >
            Movies Per Actor
          </button>
          <button 
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              activeTab === 'actorsMultipleCharacters' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            } border-gray-200`}
            onClick={() => setActiveTab('actorsMultipleCharacters')}
          >
            Actors Multiple Characters
          </button>
          <button 
            type="button"
            className={`px-4 py-2 text-sm font-medium border ${
              activeTab === 'charactersMultipleActors' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            } border-gray-200 rounded-r-lg`}
            onClick={() => setActiveTab('charactersMultipleActors')}
          >
            Characters Multiple Actors
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default MarvelMoviesApp;