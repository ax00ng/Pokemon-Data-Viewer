const { readJson, writeJson } = require("./db.js");
const path = require("path");

const POKEMON_FILE_NAME = path.join(__dirname, "../json/pokemon.json");

function getAllPokemon() {
  return readJson(POKEMON_FILE_NAME);
}

function getPokemonByDexNumber(dexNumber) {
  const list = getAllPokemon();
  return list.find((p) => p.dexNumber == dexNumber);
}

/**
 * Adds a new Pokemon to the data, retrieves data from the PokeAPI, and saves the updated data.
 *
 * @param {number} dexNumber the Pokedex number of the Pokemon to add
 */
async function addPokemon(dexNumber) {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${dexNumber}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${dexNumber}/`;
  console.log('Fetching Pokemon data from:', pokemonUrl);
  console.log('Fetching species data from:', speciesUrl);

  try {
    const [pokemonResponse, speciesResponse] = await Promise.all([
      fetch(pokemonUrl),
      fetch(speciesUrl)
    ]);

    if (!pokemonResponse.ok || !speciesResponse.ok) {
      throw new Error('Failed to fetch data from PokeAPI');
    }

    const [pokemonData, speciesData] = await Promise.all([
      pokemonResponse.json(),
      speciesResponse.json()
    ]);

    const pokemonName = pokemonData.name;
    const capitalizedPokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    const pokemonTypes = pokemonData.types.map(type => {
      return type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
    });
    const smallImageUrl = pokemonData.sprites.front_default;
    const imageUrl = pokemonData.sprites.other['home'].front_default || smallImageUrl;

    let pokedexText = "Unfortunately there's no information available";

    // Check if speciesData contains flavor_text_entries
    if (speciesData.flavor_text_entries) {
      const englishEntries = speciesData.flavor_text_entries.filter(entry => entry.language.name === 'en');
      const mostRecentEntry = englishEntries[englishEntries.length - 1];
      pokedexText = mostRecentEntry ? mostRecentEntry.flavor_text : pokedexText;
    }

    const newPokemonData = {
      dexNumber,
      name: capitalizedPokemonName,
      imageUrl,
      smallImageUrl,
      types: pokemonTypes,
      dexEntry: pokedexText
    };

    const existingData = readJson(POKEMON_FILE_NAME);

    existingData.push(newPokemonData);

    writeJson(existingData, POKEMON_FILE_NAME);

    console.log(`Data for Pokemon #${dexNumber} added to pokemon.json`);
  } catch (error) {
    console.error('Error fetching and processing Pokemon data:', error);
  }
}

module.exports = {
  getAllPokemon,
  getPokemonByDexNumber,
  addPokemon,
};
