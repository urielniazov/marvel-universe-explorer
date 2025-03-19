import React, { useState, useMemo } from 'react';

const MoviesPerActorAutocomplete = ({ actors, onSelectActor }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter actors based on input
  const filteredActors = useMemo(() => {
    if (!inputValue) return [];
    return Object.keys(actors).filter(actor => 
      actor.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [actors, inputValue]);

  const handleSelectActor = (actor) => {
    setInputValue(actor);
    onSelectActor(actor);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Type to search actors..."
        className="w-full p-3 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-marvel-primary"
        onFocus={() => setIsOpen(true)}
      />
      
      {isOpen && filteredActors.length > 0 && (
        <ul className="absolute z-10 w-full max-h-60 overflow-auto 
                       bg-white border border-gray-200 rounded-md 
                       shadow-lg mt-1">
          {filteredActors.map((actor) => (
            <li 
              key={actor}
              onClick={() => handleSelectActor(actor)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer 
                         transition-colors duration-200"
            >
              {actor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoviesPerActorAutocomplete;