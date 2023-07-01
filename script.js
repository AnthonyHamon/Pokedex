let loadedPokemons;
let pokemonInformations;

async function loadAllPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon/';
    let response = await fetch(url);
    loadedPokemons = await response.json();
    console.log(loadedPokemons);
    renderPokemonThumbnails();
}

async function loadPokemonThumbnailsInformations(i) {
    let pokemonInfoURL = loadedPokemons['results'][i]['url'];
    let url = pokemonInfoURL;
    let response = await fetch(url);
    pokemonInformations = await response.json();
}

async function renderPokemonThumbnails() {
    let pokemonThumbnailsContainer = document.getElementById('pokemonThumbnailsContainer');
    let loadedPokemonsArray = loadedPokemons['results'];
    for (let i = 0; i < loadedPokemonsArray.length; i++) {
        await loadPokemonThumbnailsInformations(i);
        const pokemon = loadedPokemonsArray[i];
        pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(pokemon, i);
        renderPokemonThumbnailsInformations(i);
    }
}

function returnPokemonThumbnails(pokemon, i) {
    let pokemonName = pokemon['name'];
    return `
    <div id="pokemonSingleCard${i}" class="pokemonSingleCard">
        <div class="p-24px">
            <h4>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h4>
            <div id="singleCardContent${i}" class="d-flex single-card-content"></div>
        </div>
    </div>
    `
}

function renderPokemonThumbnailsInformations(i) {
    let pokemonTypesArray = pokemonInformations['types'];
    for (let j = 0; j < pokemonTypesArray.length; j++) {
        const pokemonType = pokemonTypesArray[j];
    }
    let type1 = pokemonInformations['types'][0]['type']['name'];
    // let type2 = pokemonInformations['types'][1]['type']['name'];
    let img = pokemonInformations['sprites']['other']['official-artwork']['front_default'];
    let singleCardContent = document.getElementById(`singleCardContent${i}`);
    document.getElementById(`pokemonSingleCard${i}`).classList.add(`${type1}`);
    singleCardContent.innerHTML = returnPokemonThumbnailsInformations(type1, img);
}

function returnPokemonThumbnailsInformations(type1, img) {
    return `
    <div class="d-flex flex-column">
        <span>${type1}</span>
    </div>
    <div>
        <img src="${img}">
    </div>
    `
}