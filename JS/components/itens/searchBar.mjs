import { initializeSearch } from './searchLogic.mjs';

// Seleciona elementos do DOM
const searchInputs = document.querySelectorAll('.searchInput');
const searchButtons = document.querySelectorAll('.searchButton');
const suggestionsLists = document.querySelectorAll('.suggestions');
const mobileMenu = document.getElementById('mobileMenu'); // Menu mobile

// Inicializa a pesquisa
initializeSearch(searchInputs, searchButtons, suggestionsLists, mobileMenu);
