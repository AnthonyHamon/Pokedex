function returnPokemonThumbnails(loadedPokemon) {
    let type1 = pokemonInformations['types'][0]['type']['name'];
    let pokemonName = pokemonInformations['name'];
    console.log(pokemonName);
    return `
    <div onclick="openSelectedPokemonInformationsCard('${loadedPokemon}')" id="${pokemonName}" class="pokemonSingleCard ${type1}">
        <div class="p-12px">
            <div class="flex-between">
                <h4>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h4>
                <span>#${pokemonInformations['id'].toString().padStart(3, '0')}</span>
            </div>
                <div id="${loadedPokemon}CardContent" class="d-flex single-card-content">
                ${returnPokemonThumbnailsInformations()}
                </div>
        </div>
    </div>
    `;
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


function returnPokemonInformationsCard() {
    let pokemonName = pokemonInformations['name'];
    let type1 = pokemonInformations['types'][0]['type']['name'];
    let id = pokemonInformations['id'];

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
            <img onclick = "previousPokemon(${id})"id="pokemonArrowLeft" src="img/arrow-left-white.png" alt="">
            <img id="pokemonImg" src="${pokemonInformations['sprites']['other']['official-artwork']['front_default']}" alt="">
            <img onclick = "nextPokemon(${id})" id="pokemonArrowRight" src="img/arrow-right-white.png" alt="">
        </div>
    </div>
    <div class="info-container">
                <div>
                    <nav class="nav flex-around">
                        <a onclick="renderPokemonBaseStats()" href="#BaseStats">Base Stats</a>
                        <a onclick="renderPokemonEvolution()" href="#Evolutions">Evolutions</a>
                        <a onclick="renderPokemonMoves()" href="#Moves">Moves</a>
                    </nav>

                    <hr class="solid">
                    <div id="pokemonInformations">
                        ${returnTabSpinner()}
                        ${returnPokemonBaseStats()}
                    </div>
                    
                </div>
            </div>
        </div>
    `;
}

function returnTabSpinner(){

    return`
    <div id="loading-tab" class="d-none">
        <img class="loading-image spinner" src="img/pokeball-spinner.png" alt="Page is loading">
    </div>
    `
}

function returnPokemonBaseStats() {
    let selectedPokemonBaseStats = pokemonInformations['stats'];
    let hightestPossibleStat = 150;
    let type1 = pokemonInformations['types'][0]['type']['name'];
    let htmlText = "";
    for (let i = 0; i < selectedPokemonBaseStats.length; i++) {
        const BaseStats = selectedPokemonBaseStats[i];
        htmlText += `
        <table id="base-stats-table${i}">
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
        `;
    }
    return htmlText;
}

function returnHTMLPokemonMoves(pokemonMove) {
    return `
        <li>
            ${pokemonMove['move']['name']}
        </li>
    `;
}

function returnHTMLBasePokemonEvolutions() {
    let basePokemonImg = basePokemonInformations['sprites']['other']['official-artwork']['front_default'];
    return `
        <div id="pokemonEvolutionCtn" class="flex-around ">
            <div class=" flex-center pokemonEvoImg">
                <img src="${basePokemonImg}">
            </div>
        </div>
    `;
}

function returnHTMLPokemonFirstEvolution() {
    let pokemonFirstEvolutionImg = pokemonFirstEvolutionInformations['sprites']['other']['official-artwork']['front_default'];
    let type1 = pokemonInformations['types'][0]['type']['name'];
    return `
            <div class="flex-center">
                <img id="${type1}" src="img/arrow_right.png">
            </div>
            <div class=" flex-center pokemonEvoImg">
                <img src="${pokemonFirstEvolutionImg}">
            </div>
    `;
}

function returnHTMLPokemonSecondEvolution() {
    let pokemonSecondEvolutionImg = pokemonSecondEvolutionInformations['sprites']['other']['official-artwork']['front_default'];
    let type1 = pokemonInformations['types'][0]['type']['name'];
    return `
            <div class="flex-center">
                <img id="${type1}" src="img/arrow_right.png">
            </div>
            <div class=" flex-center pokemonEvoImg">
                <img src="${pokemonSecondEvolutionImg}">
            </div>
    `;
}
