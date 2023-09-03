let loadedPokemons;
let pokemonInformations;
let pokemonEvolutionChain;
let basePokemonInformations;
let pokemonFirstEvolutionInformations;
let pokemonSecondEvolutionInformations;
let query = 0;
let searchPokemonArray = [];
let isLoading = false;

async function resolve(p) {
    try {
        let response = await p;
        return [response, null];
    } catch (e) {
        return [null, e];
    }
}

function showFullPageSpinner() {
    if (isLoading == true) {
        let loadingPage = document.getElementById('loading-page');
        loadingPage.classList.remove('d-none');
    }
}

function hideFullPageSpinner() {
    if (isLoading == false) {
        let loadingPage = document.getElementById('loading-page');
        loadingPage.classList.add("d-none");
    }
}

function showEvolutionTabSpinner() {
    if (isLoading == true) {
        let loadingTab = document.getElementById('loading-tab');
        loadingTab.classList.remove('d-none');
    }
}

async function init() {
    await setPokemonNameArray();
    await loadPokedex();
}

window.onscroll = async function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
        isLoading = true;
        showFullPageSpinner();
        query = query + 50;
        await loadPokedex();
        isLoading = false;
    }
};

async function renderPokemonThumbnails() {
    let pokemonThumbnailsContainer = document.getElementById('pokemonThumbnailsContainer');
    let loadedPokemonsArray = loadedPokemons['results'];
    for (let i = 0; i < loadedPokemonsArray.length; i++) {
        let loadedPokemon = loadedPokemons['results'][i]['name'];
        // searchPokemonArray.push(loadedPokemon);
        await loadPokemonInformations(loadedPokemon);
        pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(loadedPokemon);
    }
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

async function openSelectedPokemonInformationsCard(loadedPokemon) {
    let pokemonInformationsCard = document.getElementById('pokemonInformationsCardCtn');
    await loadPokemonInformations(loadedPokemon);
    document.getElementById('pokemonInformationsCardCtn').classList.remove('d-none');
    pokemonInformationsCard.innerHTML = returnPokemonInformationsCard(loadedPokemon);
    hideLeftArrowFromPokemonCard(loadedPokemon);
    hideRighttArrowFromPokemonCard(loadedPokemon);
}

function hideLeftArrowFromPokemonCard(loadedPokemon) {
    let leftSwitchArrow = document.getElementById('pokemonArrowLeft');
    if (loadedPokemon == searchPokemonArray[0] || loadedPokemon == 1) {
        leftSwitchArrow.classList.add('d-none')
    }
}

function hideRighttArrowFromPokemonCard(loadedPokemon) {
    let rightSwitchArrow = document.getElementById('pokemonArrowRight');
    if (loadedPokemon === searchPokemonArray.lenght) {
        rightSwitchArrow.classList.add('d-none')
    }
}

function renderPokemonBaseStats() {
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.classList.remove('pokemonMovesList');
    pokemonInformationsCtn.innerHTML = returnPokemonBaseStats();
}

function renderPokemonMoves() {
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.innerHTML = '';
    let pokemonMoves = pokemonInformations['moves'];
    for (let i = 0; i < pokemonMoves.length; i++) {
        const pokemonMove = pokemonMoves[i];
        pokemonInformationsCtn.innerHTML += returnHTMLPokemonMoves(pokemonMove);
    }
    pokemonInformationsCtn.classList.add('pokemonMovesList');
}

async function renderBasePokemonEvolution(basePokemon) {
    await loadBasePokemonEvolutionInformations(basePokemon);
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.innerHTML = returnHTMLBasePokemonEvolutions();
}

async function renderFirstPokemonEvolution(basePokemon, pokemonFirstEvolution) {
    await loadBasePokemonEvolutionInformations(basePokemon);
    await loadPokemonFirstEvolutionInformation(pokemonFirstEvolution);
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.innerHTML = returnHTMLBasePokemonEvolutions();
    let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
    pokemonEvolutionCtn.innerHTML += returnHTMLPokemonFirstEvolution()
}

async function renderSecondPokemonEvolution(basePokemon, pokemonFirstEvolution, pokemonSecondEvolution) {
    await loadBasePokemonEvolutionInformations(basePokemon);
    await loadPokemonFirstEvolutionInformation(pokemonFirstEvolution);
    await loadPokemonSecondEvolutionInformation(pokemonSecondEvolution);
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.innerHTML = returnHTMLBasePokemonEvolutions();
    let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
    pokemonEvolutionCtn.innerHTML += returnHTMLPokemonFirstEvolution()
    pokemonEvolutionCtn.innerHTML += returnHTMLPokemonSecondEvolution();
}

async function renderPokemonEvolution() {
    resetTab();
    renderEvolutionTabSpinner();
    await loadPokemonEvolution();
    let basePokemon = pokemonEvolutionChain['chain']['species']['name'];
    let pokemonFirstEvolution = pokemonEvolutionChain['chain']['evolves_to'][0];
    let pokemonSecondEvolution = pokemonEvolutionChain['chain']['evolves_to'][0]['evolves_to'][0];
    if (basePokemon && !pokemonFirstEvolution) {
        await renderBasePokemonEvolution(basePokemon);
    }
    if (pokemonFirstEvolution && !pokemonSecondEvolution) {
        await renderFirstPokemonEvolution(basePokemon, pokemonFirstEvolution);
    }
    if (pokemonFirstEvolution && pokemonSecondEvolution) {
        await renderSecondPokemonEvolution(basePokemon, pokemonFirstEvolution, pokemonSecondEvolution);
    }
}

function renderEvolutionTabSpinner(){
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.innerHTML = returnTabSpinner();
}

function resetTab() {
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.classList.remove('pokemonMovesList');
}


function closeSelectedCard() {
    document.getElementById('pokemonInformationsCardCtn').classList.add('d-none');
}

function toggleLikePokemonHeart() {
    document.getElementById('heart').classList.toggle('d-none');
    document.getElementById('filledHeart').classList.toggle('d-none');
}

function previousPokemon(id) {
    id--;
    openSelectedPokemonInformationsCard(id);
}

function nextPokemon(id) {
    id++;
    openSelectedPokemonInformationsCard(id);
}

async function searchPokemon() {
    let isSearching = false;
    let inputValue = document.getElementById('searchInput').value;
    inputValue = inputValue.toLowerCase();
    let pokemonThumbnailsContainer = document.getElementById('pokemonThumbnailsContainer');
    pokemonThumbnailsContainer.innerHTML = "";
    console.log(inputValue);
    for (let i = 0; i < searchPokemonArray.length; i++) {
        const searchedPokemon = searchPokemonArray[i];
        if (searchedPokemon.toLowerCase().startsWith(inputValue) && !isSearching ) {
            isSearching == true;
            await loadPokemonInformations(searchedPokemon);
            pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(searchedPokemon);
        }
        console.log(isSearching);
    }
}