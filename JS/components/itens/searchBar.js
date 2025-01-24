// Array que mapeia palavras-chave com as seções
const sections = [
    { label: 'home', sectionId: 'home' },
    { label: 'gallery', sectionId: 'gallery' },
    { label: 'features', sectionId: 'features' },
    { label: 'about', sectionId: 'about' },
    //... adicionar mais seções aqui se necessário
    { label: 'contact', sectionId: 'contact' }
];

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestionsList = document.getElementById('suggestions');

// Função de redirecionamento
function navigateToSection() {
    const userInput = searchInput.value.trim().toLowerCase();
    const targetSection = sections.find(section => section.label === userInput);

    if (targetSection) {
        document.getElementById(targetSection.sectionId).scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('Seção não encontrada. Tente novamente!');
    }
}

// Mostrar sugestões no foco
searchInput.addEventListener('focus', () => {
    populateSuggestions('');
    suggestionsList.classList.remove('hidden');
});

// Ocultar sugestões ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        suggestionsList.classList.add('hidden');
    }
});

// Atualizar sugestões enquanto o usuário digita
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    populateSuggestions(query);
});

// Seleção de sugestão ao clicar
suggestionsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        searchInput.value = e.target.textContent;
        suggestionsList.classList.add('hidden');
    }
});

// Preencher as sugestões com base no input do usuário
function populateSuggestions(query) {
    suggestionsList.innerHTML = ''; // Limpa sugestões antigas
    const filteredSections = sections.filter(section => section.label.includes(query));
    
    if (filteredSections.length) {
        filteredSections.forEach(section => {
            const li = document.createElement('li');
            li.textContent = section.label;
            suggestionsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Nenhuma sugestão encontrada';
        li.style.color = '#aaa';
        suggestionsList.appendChild(li);
    }
}

// Evento de clique no botão "Search"
searchButton.addEventListener('click', navigateToSection);