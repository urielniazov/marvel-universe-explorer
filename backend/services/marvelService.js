export const fetchMoviesPerActor = async () => {
  // Logic for fetching movies per actor (e.g., from a database or external API)
  return {
    "actorName": ["movieName1", "movieName2"],
    "anotherActorName": ["movieName3", "movieName4"]
  };
};

export const fetchActorsWithMultipleCharacters = async () => {
  // Logic for fetching actors with multiple characters (e.g., from a database or external API)
  return {
    "actorName": [
      { "movieName": "movie1", "characterName": "characterA" },
      { "movieName": "movie2", "characterName": "characterB" }
    ],
    "anotherActorName": [
      { "movieName": "movie3", "characterName": "characterC" },
      { "movieName": "movie4", "characterName": "characterD" }
    ]
  };
};

export const fetchCharactersWithMultipleActors = async () => {
  // Logic for fetching characters with multiple actors (e.g., from a database or external API)
  return {
    "characterName": [
      { "movieName": "movie1", "actorName": "actorA" },
      { "movieName": "movie2", "actorName": "actorB" }
    ],
    "anotherCharacterName": [
      { "movieName": "movie3", "actorName": "actorC" },
      { "movieName": "movie4", "actorName": "actorD" }
    ]
  };
};
