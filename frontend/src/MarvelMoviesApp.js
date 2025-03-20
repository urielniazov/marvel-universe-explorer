import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import rootStore from './stores/RootStore';
import MoviesPerActorAutocomplete from './components/MoviesPerActorAutocomplete';
import soundtrackFile from './assets/soundtrack.mp3';

const MarvelMoviesApp = observer(() => {
  const { movieStore } = rootStore;
  const [selectedActor, setSelectedActor] = useState('');

  const audioRef = useRef(null);

  useEffect(() => {
    // Ensure the audio plays only after user interaction
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .catch(error => console.log('Autoplay prevented:', error));
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    // Fetch data based on active tab
    switch (movieStore.activeTab) {
      case 'moviesPerActor':
        movieStore.fetchMoviesPerActor();
        break;
      case 'actorsMultipleCharacters':
        movieStore.fetchActorsWithMultipleCharacters();
        break;
      case 'charactersMultipleActors':
        movieStore.fetchCharactersWithMultipleActors();
        break;
      default:
        break;
    }
  }, [movieStore, movieStore.activeTab]);

  // Render Movies Per Actor Tab
  const renderMoviesPerActor = () => {
    const actors = movieStore.moviesPerActor;

    return (
      <div className="marvel-card animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-marvel-primary">Movies Per Actor</h2>

        <div className="mb-4">
          <label htmlFor="actor-autocomplete" className="block mb-2 font-semibold">
            Select an Actor:
          </label>
          <MoviesPerActorAutocomplete
            actors={actors}
            onSelectActor={setSelectedActor}
          />
        </div>

        {selectedActor && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 text-marvel-secondary">
              Movies for {selectedActor}:
            </h3>
            <ul className="list-disc pl-5 space-y-2 max-h-64 overflow-auto">
              {actors[selectedActor].map((movie) => (
                <li
                  key={movie}
                  className="text-gray-700 hover:text-marvel-primary transition-colors"
                >
                  {movie}
                </li>
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
      <div className="marvel-card animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-marvel-primary">Actors with Multiple Characters</h2>
        {Object.entries(movieStore.actorsWithMultipleCharacters).map(([actor, characters]) => (
          <div key={actor} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-marvel-secondary">{actor}</h3>
            <table className="marvel-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Character</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((char, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td>{char.movieName}</td>
                    <td>{char.characterName}</td>
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
      <div className="marvel-card animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-marvel-primary">Characters with Multiple Actors</h2>
        {Object.entries(movieStore.charactersWithMultipleActors).map(([character, actors]) => (
          <div key={character} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-marvel-secondary">{character}</h3>
            <table className="marvel-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Actor</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((actor, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td>{actor.movieName}</td>
                    <td>{actor.actorName}</td>
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
    if (movieStore.loading) {
      return <div className="loading-state">Loading Marvel Data...</div>;
    }

    if (movieStore.error) {
      return <div className="error-state">{movieStore.error}</div>;
    }

    switch (movieStore.activeTab) {
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
    <div>
      <audio 
        ref={audioRef}
        src={soundtrackFile}
      />
      <div className="container mx-auto max-w-4xl p-4 min-h-screen">
        <h1 className="text-4xl font-marvel font-bold text-center mb-8 text-marvel-primary">
          Marvel Movies Information
        </h1>

        <div className="flex justify-center mb-6">
          <div className="inline-flex space-x-2" role="group">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${movieStore.activeTab === 'moviesPerActor'
                  ? 'bg-marvel-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => movieStore.setActiveTab('moviesPerActor')}
            >
              Movies Per Actor
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${movieStore.activeTab === 'actorsMultipleCharacters'
                  ? 'bg-marvel-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => movieStore.setActiveTab('actorsMultipleCharacters')}
            >
              Actors Multiple Characters
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${movieStore.activeTab === 'charactersMultipleActors'
                  ? 'bg-marvel-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => movieStore.setActiveTab('charactersMultipleActors')}
            >
              Characters Multiple Actors
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
});

export default MarvelMoviesApp;