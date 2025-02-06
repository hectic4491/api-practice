console.log('pokemon-fetch.js loaded');

// Assign elements
const pokeName = document.querySelector("#pokeName");
const showPokemon = document.querySelector("#showPokemon");
const pokemonPicBox = document.querySelector("#pokemonPicBox");


// Show Pokemon button
showPokemon.addEventListener("click", () => {
  let pokemonName = pokeName.value.toLowerCase();
  let URL = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
  
  fetch(URL)
  .then(response => response.json())
  .then(data => {
    if (document.getElementById("pokemonPicture")) {
      let child = document.getElementById("pokemonPicture");
      pokemonPicBox.removeChild(child);
    };
    let sprite = data.sprites.front_default;
    let img = document.createElement('img');
    img.alt = `A picture of the Pokemon named ${pokemonName}.`;
    img.src = sprite;
    img.id = "pokemonPicture";
    pokemonPicBox.appendChild(img);
  })
  .catch((error) => console.error(error));
});