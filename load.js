async function setPokemonNameArray() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${loadedPokemons['count']}`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        let allPokemon = await response.json();
        let allPokemonArray = allPokemon['results']
        for (let i = 0; i < allPokemonArray.length; i++) {
            let allPokemonName = allPokemonArray[i]['name'];
            searchPokemonArray.push(allPokemonName);
        }
    }
    if (error) {
        alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
    }
}

async function loadPokedex() {
    isSearching = false;
    isLoading = true;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${query}&limit=50`; // load pokedex from query value;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        loadedPokemons = await response.json();
        await renderPokemonThumbnails();
        isLoading = false;
        hideFullPageSpinner();
    }
    if (error) {
        alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
    }
}

async function loadPokemonInformations(loadedPokemonName) {
    isLoading = true;
    let url = `https://pokeapi.co/api/v2/pokemon/${loadedPokemonName}/`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        pokemonInformations = await response.json();
    }
    if (error) {
        alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
    }
    isLoading = false;
}

async function loadPokemonEvolution() {
    isLoading = true;
    showEvolutionTabSpinner();
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonInformations['name']}`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        let pokemonEvolutions = await response.json();
        let evolutionChainURL = pokemonEvolutions['evolution_chain']['url'];
        let evolutionChainResponse = await fetch(evolutionChainURL);
        pokemonEvolutionChain = await evolutionChainResponse.json();
        isLoading = false;
        console.log(pokemonEvolutionChain)
    }
    if (error) {
        alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
    }
}

async function loadBasePokemonEvolutionInformations(basePokemon) {
    isLoading = true;
    showEvolutionTabSpinner();
    let url = `https://pokeapi.co/api/v2/pokemon/${basePokemon}/`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        basePokemonInformations = await response.json();
        isLoading = false;
    }
    if (error) {
        if (error) {
            alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
        }
    }
}

async function loadPokemonFirstEvolutionInformation(pokemonFirstEvolution) {
    isLoading = true;
    showEvolutionTabSpinner();
    let pokemonFirstEvolutionName = pokemonFirstEvolution['species']['name'];
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonFirstEvolutionName}/`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        pokemonFirstEvolutionInformations = await response.json();
        isLoading = false;
    }
    if (error) {
        if (error) {
            alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
        }
    }
}

async function loadPokemonSecondEvolutionInformation(pokemonSecondEvolution) {
    isLoading = true;
    showEvolutionTabSpinner();
    let pokemonSecondEvolutionName = pokemonSecondEvolution['species']['name'];
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonSecondEvolutionName}/`;
    let [response, error] = await resolve(fetch(url));
    if (response) {
        pokemonSecondEvolutionInformations = await response.json();
        isLoading = false;
    }
    if (error) {
        if (error) {
            alert('Ein fehler ist aufgetreten, versuche es bitte nochmal');
        }
    }
}