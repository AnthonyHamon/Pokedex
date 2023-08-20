let loadedPokemons;
let pokemonInformations;
let pokemonEvolutionChain;
let basePokemonInformations;
let pokemonFirstEvolutionInformations;
let pokemonSecondEvolutionInformations;
let query = 0;
let isLoading = false;
let index = 0;

async function loadPokedex() {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${query}&limit=50`; // load pokedex from query value;
    let response = await fetch(url);
    loadedPokemons = await response.json();
    console.log(loadedPokemons);
    renderPokemonThumbnails();
}

window.onscroll = async function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
        isLoading = true;
        query = query + 20;
        await loadPokedex();
        setTimeout(() => {
            isLoading = false;
        }, 1000)
    }
};

async function loadPokemonInformations(index) {
    let url = `https://pokeapi.co/api/v2/pokemon/${index}/`;
    let response = await fetch(url);
    pokemonInformations = await response.json();
}

async function renderPokemonThumbnails() {
    let pokemonThumbnailsContainer = document.getElementById('pokemonThumbnailsContainer');
    let loadedPokemonsArray = loadedPokemons['results'];
    for (let i = 0; i < loadedPokemonsArray.length; i++) {
        index++
        await loadPokemonInformations(index);
        const pokemon = loadedPokemonsArray[i];
        pokemonThumbnailsContainer.innerHTML += returnPokemonThumbnails(pokemon, index);
    }
}

function returnPokemonThumbnails(pokemon, index) {
    let pokemonName = pokemon['name'];
    let type1 = pokemonInformations['types'][0]['type']['name'];

    return `
    <div onclick="openSelectedPokemonInformationsCard(${index})" id="${pokemonName}" class="pokemonSingleCard ${type1}">
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

async function openSelectedPokemonInformationsCard(index) {
    let pokemonInformationsCard = document.getElementById('pokemonInformationsCardCtn');
    await loadPokemonInformations(index);
    // await loadNextPokemonInformations(index);
    document.getElementById('pokemonInformationsCardCtn').classList.remove('d-none');
    console.log('current Pokemon is', pokemonInformations['name']);
    pokemonInformationsCard.innerHTML = returnPokemonInformationsCard(index);
    console.log(pokemonInformations);

}

function returnPokemonInformationsCard(index) {
    let pokemonName = pokemonInformations['name'];
    let type1 = pokemonInformations['types'][0]['type']['name'];

    return `
    <div class="pokemonCard">
    <div id="pokemonCardHeader" class="${type1}">
        <div class="flex-between filter-white">
            <img style="cursor:pointer" onclick="closeSelectedCard()" src="img/arrow-left.png">
            <div>
                <img onclick="toggleLikePokemonHeart()" id="heart" src="img/heart.png">
                <img onclick="toggleLikePokemonHeart()" id="filledHeart" src="img/filled_heart.png" class="d-none">
            </div>
        </div>
        <div class="flex-between pt-2">
            <div id="pokemonNameCtn">
                <h2 id="${pokemonName}">${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
                <div>
                    <div>
                        <span id="${pokemonInformations['type']}"></span>
                    </div>
                    <div class="pokemonDimension mt-1">
                        <div>Height: <b id="pokemonHeight">${pokemonInformations['height'] / 10} m</b></div>
                        <span>|</span>
                        <div>Weight: <b id="pokemonWeight">${pokemonInformations['weight'] / 10} KG</b></div>
                    </div>
                </div>
            </div>
            <span id="pokemonID">#${pokemonInformations['id'].toString().padStart(3, '0')}</span>
        </div>
        <div class="flex-between">
            <img onclick = "previousPokemon(${index})"id="pokemonArrowLeft" src="img/arrow-left-white.png" alt="">
            <img id="pokemonImg" src="${pokemonInformations['sprites']['other']['official-artwork']['front_default']}" alt="">
            <img onclick = "nextPokemon(${index})" id="pokemonArrowRight" src="img/arrow-right-white.png" alt="">
        </div>
    </div>
    <div class="info-container">
                <div>
                    <nav class="nav flex-around">
                        <a onclick="renderPokemonBaseStats()" href="#BaseStats">Base Stats</a>
                        <a onclick="renderPokemonEvolution()" href="#Evolutions">Evolution</a>
                        <a onclick="renderPokemonMoves()" href="#Moves">Moves</a>
                    </nav>

                    <hr class="solid">
                    <div id="pokemonInformations">
                    ${returnPokemonBaseStats()}
                    </div>
                    
                </div>
            </div>
        </div>
    `
};

function renderPokemonBaseStats() {
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.classList.remove('pokemonMovesList');
    pokemonInformationsCtn.innerHTML = returnPokemonBaseStats();
}

function returnPokemonBaseStats() {
    let selectedPokemonBaseStats = pokemonInformations['stats'];
    let hightestPossibleStat = 150;
    let type1 = pokemonInformations['types'][0]['type']['name'];
    let htmlText = "";
    for (let i = 0; i < selectedPokemonBaseStats.length; i++) {
        const BaseStats = selectedPokemonBaseStats[i];
        htmlText += `
        <table>
            <tr>
                <td>${BaseStats['stat']['name']}</td>
                <td>${BaseStats['base_stat']}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar ${type1}" role="progressbar" style='width: ${(BaseStats['base_stat'] / hightestPossibleStat) * 100}%';
                            aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </td>
            </tr>
        </table>
        `
    }
    return htmlText;
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

function returnHTMLPokemonMoves(pokemonMove) {
    return `
        <li>
            ${pokemonMove['move']['name']}
        </li>
    `;
}

async function loadPokemonEvolution() {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonInformations['name']}`;
    let response = await fetch(url);
    let pokemonEvolutions = await response.json();
    console.log(pokemonEvolutions);
    let evolutionChainURL = pokemonEvolutions['evolution_chain']['url'];
    let evolutionChainResponse = await fetch(evolutionChainURL);
    pokemonEvolutionChain = await evolutionChainResponse.json();
    console.log(pokemonEvolutionChain);
}

async function checkPokemonEvolutions() {
    let basePokemon = pokemonEvolutionChain['chain']['species']['name'];
    let pokemonFirstEvolution = pokemonEvolutionChain['chain']['evolves_to'];
    let pokemonSecondEvolution = pokemonEvolutionChain['chain']['evolves_to'][0]['evolves_to'][0];
    if (pokemonFirstEvolution &&!pokemonSecondEvolution) {
        let pokemonFirstEvolutionName = pokemonFirstEvolution[0]['species']['name'];
        await loadBasePokemonEvolutionInformations(basePokemon);
        await loadPokemonFirstEvolutionInformation(pokemonFirstEvolutionName);
    }

    if (pokemonFirstEvolution && pokemonSecondEvolution) {
        let pokemonFirstEvolution = pokemonEvolutionChain['chain']['evolves_to'][0]['species']['name'];
        let pokemonSecondEvolutionName = pokemonSecondEvolution['species']['name'];
        await loadBasePokemonEvolutionInformations(basePokemon);
        await loadPokemonFirstEvolutionInformation(pokemonFirstEvolution);
        await loadPokemonSecondEvolutionInformation(pokemonSecondEvolutionName);
    }
}

async function loadBasePokemonEvolutionInformations(basePokemon) {
    let url1 = `https://pokeapi.co/api/v2/pokemon/${basePokemon}/`;
    let response1 = await fetch(url1);
    basePokemonInformations = await response1.json();
}

async function loadPokemonFirstEvolutionInformation(pokemonFirstEvolution){
    let url2 = `https://pokeapi.co/api/v2/pokemon/${pokemonFirstEvolution}/`;
    let response2 = await fetch(url2);
    pokemonFirstEvolutionInformations = await response2.json();
}

 async function loadPokemonSecondEvolutionInformation(pokemonSecondEvolution){
    let url3 = `https://pokeapi.co/api/v2/pokemon/${pokemonSecondEvolution}/`;
    let response3 = await fetch(url3);
    pokemonSecondEvolutionInformations = await response3.json();
    console.log(pokemonSecondEvolutionInformations);
}

async function renderPokemonEvolution() {
    await loadPokemonEvolution();
    await checkPokemonEvolutions();
    let pokemonInformationsCtn = document.getElementById('pokemonInformations');
    pokemonInformationsCtn.classList.remove('pokemonMovesList');
    pokemonInformationsCtn.innerHTML = returnHTMLBasePokemonEvolutions();
    let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
        pokemonEvolutionCtn.innerHTML += returnHTMLPokemonFirstEvolution();
        pokemonEvolutionCtn.innerHTML += returnHTMLPokemonSecondEvolution();
    }

function returnHTMLBasePokemonEvolutions() {
    let basePokemonImg = basePokemonInformations['sprites']['other']['official-artwork']['front_default'];
    return `
        <div id="pokemonEvolutionCtn" class="flex-around ">
            <div class=" flex-center pokemonEvoImg">
                <img src="${basePokemonImg}">
            </div>
        </div>
    `
}

function returnHTMLPokemonFirstEvolution(){
    let pokemonFirstEvolutionImg = pokemonFirstEvolutionInformations['sprites']['other']['official-artwork']['front_default'];
    let type1 = pokemonInformations['types'][0]['type']['name'];
    return `
            <div class="flex-center">
                <img id="${type1}" src="img/arrow_right.png">
            </div>
            <div class=" flex-center pokemonEvoImg">
                <img src="${pokemonFirstEvolutionImg}">
            </div>
    `
}

function returnHTMLPokemonSecondEvolution(){
    let pokemonSecondEvolutionImg = pokemonSecondEvolutionInformations['sprites']['other']['official-artwork']['front_default'];
    let type1 = pokemonInformations['types'][0]['type']['name'];
    return `
            <div class="flex-center">
                <img id="${type1}" src="img/arrow_right.png">
            </div>
            <div class=" flex-center pokemonEvoImg">
                <img src="${pokemonSecondEvolutionImg}">
            </div>
    `
}

function returnHTMLPokemonEvolution() {
    let type1 = pokemonInformations['types'][0]['type']['name'];
    let nextPokemonImg = nextPokemonInformations['sprites']['other']['official-artwork']['front_default'];
    return `
        <div class="flex-center">
            <img id="${type1}" src="img/arrow_right.png">
        </div>
        <div>
            <img src="${nextPokemonImg}" alt="pokemon Evolution">
        </div>
    `
}


function closeSelectedCard() {
    pokemonEvolutionFound = false;
    document.getElementById('pokemonInformationsCardCtn').classList.add('d-none');
}

function toggleLikePokemonHeart() {
    document.getElementById('heart').classList.toggle('d-none');
    document.getElementById('filledHeart').classList.toggle('d-none');
}

function previousPokemon(index) {
    pokemonEvolutionFound = false;
    index--;
    openSelectedPokemonInformationsCard(index);
}

function nextPokemon(index) {
    pokemonEvolutionFound = false;
    index++;
    console.log('index is', index + 1)
    openSelectedPokemonInformationsCard(index);
}

function searchPokemon() {
    let inputValue = document.getElementById('searchInput').value;
    console.log('hello');
}



// function findPokemonEvolution() {
//     try {
//         checkForPokemonEvolution();
//     } catch (error) {
//         console.log(error)
//     }
// }

// async function renderPokemonEvolution() {
//     await loadPokemonEvolution();
//     let pokemonInformationsCtn = document.getElementById('pokemonInformations');
//     pokemonInformationsCtn.classList.remove('pokemonMovesList');
//     let currentPokemonImg = pokemonInformations['sprites']['other']['official-artwork']['front_default'];
//     pokemonInformationsCtn.innerHTML = returnHTMLCurrentPokemonEvolution(currentPokemonImg);
//     let pokemonEvolutionCtn = document.getElementById('pokemonEvolutionCtn');
//     if (pokemonEvolutionFound === true) {
//         pokemonEvolutionCtn.innerHTML += returnHTMLPokemonEvolution();
//     }
// }

// function checkForPokemonEvolution() {
//     if (pokemonEvolutions['chain']['evolves_to'][0]) {
//         let pokemonFirstEvolution = pokemonEvolutions['chain']['evolves_to'][0]['species']['name'];
//         if (pokemonFirstEvolution === nextPokemonInformations['name']) {
//             pokemonEvolutionFound = true;
//         }
//     }
//     if (pokemonEvolutions['chain']['evolves_to'][0] && pokemonEvolutions['chain']['evolves_to'][0]['evolves_to'][0]) {
//         let pokemonSecondEvolution = pokemonEvolutions['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];

//         if (pokemonSecondEvolution === nextPokemonInformations['name']) {
//             pokemonEvolutionFound = true;
//         }
//     }
// }


// function returnHTMLCurrentPokemonEvolution(currentPokemonImg) {
//     return `
//         <div id="pokemonEvolutionCtn" class="flex-around pokemonEvoImg">
//             <div>
//                 <img src="${currentPokemonImg}">
//             </div>
//         </div>
//     `
// }

// function returnHTMLPokemonEvolution() {
//     let type1 = pokemonInformations['types'][0]['type']['name'];
//     let nextPokemonImg = nextPokemonInformations['sprites']['other']['official-artwork']['front_default'];
//     return `
//         <div class="flex-center">
//             <img id="${type1}" src="img/arrow_right.png">
//         </div>
//         <div>
//             <img src="${nextPokemonImg}" alt="pokemon Evolution">
//         </div>
//     `
// }

