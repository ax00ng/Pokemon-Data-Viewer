const express = require("express");
const { getAllPokemon, getPokemonByDexNumber} = require("../db/pokemon-db");
const router = express.Router();

router.get("/", function (req, res) {
  // TODO Add necessary data to res.locals before rendering the "home" page.
  const allPokemon = getAllPokemon();
  const favoritePokemon = getPokemonByDexNumber(54);

  res.render("home", { pokemonList: allPokemon, favoritePokemon: favoritePokemon, });
});

module.exports = router;
