let loadedPokemons;
let pokemonInformations;
let query = 0;
let isLoading = false;

async function loadPokedex() {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${query}&limit=50`;
    let response = await fetch(url);
    loadedPokemons = await response.json();
    console.log(loadedPokemons);
    renderPokemonThumbnails();
    
}

 window.onscroll = async function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
        isLoading = true;
        await loadMorePokemons();
        setTimeout (()=>{
            isLoading = false;
        },3000)
    }
};

 async function loadMorePokemons() {
    query = query + 50;
    await loadPokedex();
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
        pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(pokemon);
    }
}

function returnPokemonThumbnails(pokemon) {
    let pokemonName = pokemon['name'];
    let type1 = pokemonInformations['types'][0]['type']['name'];

    return `
    <div onclick="openSelectedCard(${pokemon})" id="pokemon-${pokemonName}" class="pokemonSingleCard ${type1}">
        <div class="p-12px">
            <div class="flex-between">
                <h4>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h4>
                <span>#${pokemonInformations['id'].toString().padStart(3, '0')}</span>
            </div>
                <div id="${pokemonName}CardContent" class="d-flex single-card-content">
                ${returnPokemonThumbnailsInformations()}
                </div>
        </div>
    </div>
    `
}

function returnPokemonThumbnailsInformations() {
    return `
    <div class="d-flex flex-column">
        ${returnPokemonTypeInformation()}    
    </div>
    <div class="single-card-content-img">
        <img src="${pokemonInformations['sprites']['other']['official-artwork']['front_default']}">
    </div>
    `
}

function returnPokemonTypeInformation() {
    let pokemonTypesArray = pokemonInformations['types'];
    let htmlText = "";
    for (let j = 0; j < pokemonTypesArray.length; j++) {
        const pokemonType = pokemonTypesArray[j];
        htmlText += `<span>${pokemonType['type']['name']}</span>`
    };

    return htmlText;
}

function openSelectedCard(pokemon){
    document.getElementById('pokemonCardCtn').classList.remove('d-none');
    console.log('current Pokemon is', pokemon['name'])
}

function closeSelectedCard(){
    document.getElementById('pokemonCardCtn').classList.add('d-none');
}