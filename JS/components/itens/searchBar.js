import { initializeSearch } from './searchLogic.mjs';

const searchInputs = document.querySelectorAll('.searchInput');
const searchButtons = document.querySelectorAll('.searchButton');
const suggestionsLists = document.querySelectorAll('.suggestions');
const mobileMenu = document.getElementById('mobileMenu');

initializeSearch(searchInputs, searchButtons, suggestionsLists, mobileMenu);