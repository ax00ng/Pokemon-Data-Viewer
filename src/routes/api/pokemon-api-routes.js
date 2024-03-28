const express = require("express");
const router = express.Router();
const { getPokemonByDexNumber, getAllPokemon, addPokemon} = require("../../db/pokemon-db");

// TODO Add an API endpoint here.
// When sending a GET request for /:dexNumber (:dexNumber is a path param),
// return the JSON representation of the correct Pokemon, or return a 404 error
// if that Pokemon is not found.

router.get("/:dexNumber", function (req, res) {
    const dexNumber = req.params.dexNumber;
    const pokemonNumber = getPokemonByDexNumber(dexNumber);

    if (pokemonNumber) {
        res.json(pokemonNumber);
    } else {
        res.status(404).json({ error: "Pokemon not found" });
    }
});

module.exports = router;
