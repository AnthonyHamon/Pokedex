let loadedPokemons;
let pokemonInformations;
let pokemonEvolutionChain;
let basePokemonInformations;
let pokemonFirstEvolutionInformations;
let pokemonSecondEvolutionInformations;
let query = 0;
let searchPokemonArray = [];
let isLoading = false;
let isSearching = false;
let timer;


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
    await loadPokedex();
    await setPokemonNameArray();
}

window.onscroll = async function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading && !isSearching) {
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
        await loadPokemonInformations(loadedPokemon);
        pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(loadedPokemon);
    }
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
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    if (pokemonFirstEvolution.length > 1){
        pokemonInformationsCtn += returnHTMLAlternativEvolution();
    }else{
        await loadPokemonFirstEvolutionInformation(pokemonFirstEvolution);
        pokemonInformationsCtn.innerHTML = returnHTMLBasePokemonEvolutions();
        let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
        pokemonEvolutionCtn.innerHTML += returnHTMLPokemonFirstEvolution();
    }
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
    let pokemonEvolutionChainLenght = pokemonEvolutionChain['chain']['evolves_to'];
    if(pokemonEvolutionChainLenght.length > 1){
        showAlternativPokemonEvolution();
    }else{
        await showPokemonEvolutions();
    }
}

async function showPokemonEvolutions(){
    let basePokemon = pokemonEvolutionChain['chain']['species']['name'];
    let pokemonFirstEvolution = pokemonEvolutionChain['chain']['evolves_to'][0];
    let pokemonSecondEvolution = pokemonFirstEvolution ? pokemonFirstEvolution['evolves_to'][0]: null;
    if (!pokemonFirstEvolution) {
        await renderBasePokemonEvolution(basePokemon);
    } else if (!pokemonSecondEvolution) {
        await renderFirstPokemonEvolution(basePokemon, pokemonFirstEvolution);
    }else {
        await renderSecondPokemonEvolution(basePokemon, pokemonFirstEvolution, pokemonSecondEvolution);
    }
}

async function showAlternativPokemonEvolution(){
    let basePokemon = pokemonEvolutionChain['chain']['species']['name'];
    await renderBasePokemonEvolution(basePokemon);
    let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
    pokemonEvolutionCtn.innerHTML += returnHTMLAlternativEvolution();
}

function renderEvolutionTabSpinner() {
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
    clearTimeout(timer);
    isSearching = true;
    timer = setTimeout(async () => {
        let inputValue = document.getElementById('searchInput').value.toLowerCase();
        let pokemonThumbnailsContainer = document.getElementById('pokemonThumbnailsContainer');
        pokemonThumbnailsContainer.innerHTML = "";
        if (inputValue.length < 2) {
            loadPokedex();
            return;
        }
        await renderSearchedPokemons(inputValue);
    }, 300);
}

async function renderSearchedPokemons(inputValue) {
    for (let i = 0; i < searchPokemonArray.length; i++) {
        const searchedPokemon = searchPokemonArray[i].toLowerCase();
        if (searchedPokemon.startsWith(inputValue)) {
            await loadPokemonInformations(searchedPokemon);
            pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(searchedPokemon);
        }
    }
}