document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('search');
  const clearButton = document.getElementById('clear');
  const gridContainer = document.getElementById('grid-container');
  const pokemonNameInput = document.getElementById('pokemon-name');
  const pokemonTypeSelect = document.getElementById('pokemon-type');
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  function createPokemonCard(pokemonData) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('pokemon-card');
    cardDiv.innerHTML = `
          <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name} image">
          <h2>${pokemonData.name}</h2>
          <p class="${pokemonData.types[0].type.name}">${pokemonData.types[0].type.name}</p>
      `;
    gridContainer.appendChild(cardDiv);
  }

  function clearGrid() {
    gridContainer.innerHTML = '';
  }

  async function fetchPokemons() {
    try {
      clearGrid();
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      const pokemons = data.results;

      for (const pokemon of pokemons) {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error('Network response was not ok.');
        }
        const pokemonData = await pokemonResponse.json();
        createPokemonCard(pokemonData);
      }
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  }

  function filterByType(type) {
    clearGrid();
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const pokemons = data.results;
        for (const pokemon of pokemons) {
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((pokemonDetails) => {
              const firstType = pokemonDetails.types[0].type.name;
              if (firstType === type) {
                createPokemonCard(pokemonDetails);
              }
            });
        }
      });
  }

  searchButton.addEventListener('click', function () {
    const selectedType = pokemonTypeSelect.value;
    if (selectedType === 'all') {
      fetchPokemons();
    } else {
      filterByType(selectedType);
    }
  });

  clearButton.addEventListener('click', clearGrid);

  fetchPokemons();
});
