let currentPokemon;

async function loadPokemon(){
    let url = 'https://pokeapi.co/api/v2/pokemon/charmander';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('Abgerufene Pokemon ist:', currentPokemon);

    renderPokemonInfo();
    renderPokemonStats();
}

function renderPokemonInfo(){
    let pokemonName = currentPokemon['name'];
    let pokemonType = currentPokemon['types'][0]['type']['name'];
    let pokemonHeight = currentPokemon['height'];
    let pokemonWeight = currentPokemon['weight'];
    let pokemonID = document.getElementById('pokemonID');
    document.getElementById('pokemonName').innerHTML = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonType').innerHTML = pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1);
    document.getElementById('pokemonHeight').innerHTML += (pokemonHeight/10) + " m";
    document.getElementById('pokemonWeight').innerHTML += (pokemonWeight/10) + " KG";
    pokemonID.innerHTML += currentPokemon['id'].toString().padStart(3, '0');
}

function renderPokemonStats(){
    document.getElementById('HP').children[1].innerHTML = currentPokemon['stats'][0]['base_stat'];
    document.getElementById('atk').children[1].innerHTML = currentPokemon['stats'][1]['base_stat'];
    document.getElementById('def').children[1].innerHTML = currentPokemon['stats'][2]['base_stat'];
    document.getElementById('sp-atk').children[1].innerHTML = currentPokemon['stats'][3]['base_stat'];
    document.getElementById('sp-def').children[1].innerHTML = currentPokemon['stats'][4]['base_stat'];
    document.getElementById('speed').children[1].innerHTML = currentPokemon['stats'][5]['base_stat'];
    calcStatsTotal();
}

function calcStatsTotal(){
    let pokemonHP = currentPokemon['stats'][0]['base_stat'];
    let pokemonAtk = currentPokemon['stats'][1]['base_stat'];
    let pokemonDef = currentPokemon['stats'][2]['base_stat'];
    let pokemonSpAtk = currentPokemon['stats'][3]['base_stat'];
    let pokemonSpDef = currentPokemon['stats'][4]['base_stat'];
    let pokemonSpeed= currentPokemon['stats'][5]['base_stat'];
    let pokemonTotal = pokemonHP + pokemonAtk + pokemonDef + pokemonSpAtk + pokemonSpDef + pokemonSpeed; 
    document.getElementById('total').children[1].innerHTML = pokemonTotal;
}

function renderStatsProgressBar(){
    
}