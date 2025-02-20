const pokeSearch = document.querySelector('.poke-search');
if (!pokeSearch) {
    console.error("Elemento '.poke-search' non trovato");
}

const input = document.getElementById('pokemon');
const clearButton = document.querySelector('.clear-button');
let currentPokemonId = null;

const typeColors = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
    grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
    ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
    steel: "#B7B7CE", fairy: "#D685AD"
};

// HIDE-SHOW CLEAR BUTTON
input.addEventListener('input', function() {
    if (input.value.trim()) {
        clearButton.classList.remove('hide');
        clearButton.classList.add('show');
    } else {
        clearButton.classList.remove('show');
        clearButton.classList.add('hide');
        resetRisultati();
    }
});

clearButton.addEventListener('click', function () {
    input.value = '';
    clearButton.classList.remove('show');
    clearButton.classList.add('hide');
    input.focus();
});

// CALL API POKEMON
function cercaPokemon(e, id) {
    if (e) e.preventDefault();

    let pokemonId = id !== undefined ? id : input.value.trim().toLowerCase();

    if (!pokemonId) {
        alert('Il campo di ricerca non può essere vuoto.');
        return;
    }

    const BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;
    
    fetch(`${BASE_URL}${pokemonId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Pokémon "${pokemonId}" non trovato.`);
            }
            return res.json();
        })
        .then(pokeData => {
            currentPokemonId = pokeData.id;
            renderPokemon(pokeData);
        })
        .catch(err => {
            alert(err.message);
            resetRisultati();
        });
}

// CREAZIONE CARD POKEMON
function renderPokemon(dati) {
    resetRisultati();

    const card = document.createElement('div');
    card.classList.add('card');

    if (dati.types.length === 1) {
        card.classList.add(dati.types[0].type.name);
        card.style.setProperty('--color1', typeColors[dati.types[0].type.name]);
        card.style.setProperty('--color2', typeColors[dati.types[0].type.name]);
    } else if (dati.types.length === 2) {
        card.classList.add(dati.types[0].type.name, dati.types[1].type.name);
        card.style.setProperty('--color1', typeColors[dati.types[0].type.name]);
        card.style.setProperty('--color2', typeColors[dati.types[1].type.name]);
    }

    let tipo = dati.types.map(t => `<span>${t.type.name}</span>`).join(' ');

    card.innerHTML = `
        <div class='container-media'>
            <button id='prev'>◀</button>
            <div class='media'>
                <img src='${dati.sprites.front_default}' alt='${dati.name}'>
                <h2>${dati.name}</h2>
            </div>
            <button id='next'>▶</button>
        </div>
        <div class='info'>
            ${tipo}
        </div>
        <ul>
            <li><span>Punti Vita:</span> ${dati.stats[0].base_stat}</li>
            <li><span>Punti Attacco:</span> ${dati.stats[1].base_stat}</li>
            <li><span>Punti Difesa:</span> ${dati.stats[2].base_stat}</li>
        </ul>
    `;

    pokeSearch.insertAdjacentElement('afterend', card);

    // Bottoni navigazione Pokémon precedente e successivo
    document.getElementById('prev').addEventListener('click', () => {
        if (currentPokemonId > 1) cercaPokemon(null, currentPokemonId - 1);
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentPokemonId < 1000) cercaPokemon(null, currentPokemonId + 1);
    });
}

// RESETTA LA CARD PRECEDENTE
function resetRisultati() {
    const card = pokeSearch?.nextElementSibling;
    if (card) card.remove();
}

// // PULISCE E SANIFICA I DATI DEL FORM
// function cleanData(form) {
//     if (!form) return [];
//     const dataInviati = new FormData(form);
//     return [...dataInviati.values()].map(sanificaDati);
// }

function sanificaDati(input) {
    return input ? input.trim().toLowerCase() : "";
}

pokeSearch?.addEventListener('submit', cercaPokemon);

// TOGGLE CLEAR ICON
// function toggleClearIcon() {
//     const campoInput = document.getElementById('pokemon');
//     const clearIcon = document.getElementById('clearIcon');
//     clearIcon.style.display = campoInput.value.length > 0 ? 'inline' : 'none';
// }
