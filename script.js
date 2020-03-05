const CONTAINER = document.querySelector('.container')
const SEARCH_POKEMON = document.querySelector('[data-search-pokemon]')

const fetchPokemon = async () => {
    const URL = `https://pokeapi.co/api/v2/pokemon?limit=800/`
    const RES = await fetch(URL)
    const DATA = await RES.json()
    const POKEMON = DATA.results.map((result, index) => ({
        ...result,
        id: index + 1,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        apiURL: result.url
    }))

    displayPokemon(POKEMON)
    searchPokemon(POKEMON)
}

const cardTemplate = pokemon => (
    `
        <div class="card-container" onClick="selectPokemon(${pokemon.id})">
            <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}"/>
            <h2 class="pokemon-name">${pokemon.id}. ${pokemon.name}</h2>
        </div>
        `
)
const displayPokemon = (pokemons) => {
    const CARDS = pokemons.map(pokemon =>
        cardTemplate(pokemon)
    ).join('')

    CONTAINER.innerHTML = CARDS
}

function toggleActiveClass(event) {
    const SEARCH_WRAPPER = document.querySelector('.search-wrapper')

    event.preventDefault()

    if(event.target.classList.contains('search-icon') || event.target.parentElement.classList.contains('search-icon') && !SEARCH_WRAPPER.classList.contains('active')) {
        SEARCH_WRAPPER.classList.add('active')
        SEARCH_POKEMON.focus()
    } else if(event.target.classList.contains('close')) {
        SEARCH_WRAPPER.classList.remove('active')
    }
}

const toggleSearchBar = () => {
    const SEARCH_INPUT = document.querySelector('.input-holder')
    const CLOSE_SELECTOR = document.querySelector('.search-wrapper .close')

    SEARCH_INPUT.addEventListener('click', toggleActiveClass)
    CLOSE_SELECTOR.addEventListener('click', toggleActiveClass)
}

const selectPokemon = async id => {
    const URL = `https://pokeapi.co/api/v2/pokemon/${id}/`
    const RES = await fetch(URL)
    const DATA = await RES.json()

    displayModal(DATA)
}

const modalTemplate = data => (
    `
        <div class="modal-container">
            <div class="modal-card">
                <span class="close-modal">X</span>
                <img class="pokemon-image" src="${data.image}" alt="${data.name}"/>
                <h2 class="pokemon-name">${data.name}</h2>
                <p class="pokemon-type">Type: <span>${data.type}</span></p>
                <p class="pokemon-abilities">Abilities: <span>${data.abilities}</span></p>
                <p class="pokemon-weight">Weight: <span>${data.weight}</span></p>
                ${data.stats}
            </span>
        </div>
    `
)

const closeModal = () => {
    const MODAL_CONTAINER = document.querySelector('.modal-container')

    document.body.classList.remove('modal')
    MODAL_CONTAINER.remove()
}

const displayModal = data => {
    const POKEMON_INFORMATION = {
        name: data.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        abilities: data.abilities.map(ability => ability.ability.name).join(','),
        weight: data.weight,
        type: data.types.map(type => type.type.name).join(','),
        stats: data.stats.map(stat => (
            `<p class="pokemon-stats">${stat.stat.name}: <span>${stat.base_stat}</span></p>`
        )).join('')
    }

    CONTAINER.innerHTML = CONTAINER.innerHTML + modalTemplate(POKEMON_INFORMATION)

    const CLOSE_MODAL = document.querySelector('.close-modal')
    document.body.classList.add('modal')

    CLOSE_MODAL.addEventListener('click', closeModal)
}

const searchPokemon = POKEMON => {
    SEARCH_POKEMON.addEventListener('input', e => {
        CONTAINER.innerHTML = ''

        if(e.target.value.length >= 1) {
            const filteredPokemons = POKEMON.filter(pokemon => pokemon.name.includes(e.target.value))

            if(filteredPokemons.length >= 1) {
                document.querySelector('.no-results').classList.add('hide')
                displayPokemon(filteredPokemons)
            } else {
                document.querySelector('.no-results').classList.remove('hide')
            }

        } else {
            displayPokemon(POKEMON)
        }
    })
}

toggleSearchBar()
fetchPokemon()