export function initializeSearch(searchInputs, searchButtons, suggestionsLists, mobileMenu) {
    // Array que mapeia palavras-chave com as seções
    const sections = [
        { label: 'home', sectionId: 'home' },
        { label: 'learn', sectionId: 'learn' },
        { label: 'features', sectionId: 'features' },
        { label: 'about', sectionId: 'about' },
        { label: 'contact', sectionId: 'contact' },
        { label: 'maps', sectionId: 'maps' },
        { label: 'blog', sectionId: 'blog' }
    ];

    // Função de navegação
    function navigateToSection(input) {
        const userInput = input.value.trim().toLowerCase();
        const targetSection = sections.find(section => section.label === userInput);

        if (targetSection) {
            document.getElementById(targetSection.sectionId).scrollIntoView({ behavior: 'smooth' });

            // Fecha o menu mobile se estiver aberto
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        } else {
            alert('Seção não encontrada. Tente novamente!');
        }
    }

    // Função para preencher sugestões
    function populateSuggestions(input, suggestionsList) {
        const query = input.value.trim().toLowerCase();
        suggestionsList.innerHTML = '';

        const filteredSections = sections.filter(section => section.label.includes(query));

        if (filteredSections.length) {
            filteredSections.forEach(section => {
                const li = document.createElement('li');
                li.textContent = section.label;
                li.addEventListener('click', () => {
                    input.value = section.label;
                    suggestionsList.classList.add('hidden');
                    navigateToSection(input); // Redireciona ao clicar
                });
                suggestionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma sugestão encontrada';
            li.style.color = '#aaa';
            suggestionsList.appendChild(li);
        }
    }

    // Adiciona eventos para cada campo de busca
    searchInputs.forEach((input, index) => {
        const suggestionsList = suggestionsLists[index];

        input.addEventListener('focus', () => {
            populateSuggestions(input, suggestionsList);
            suggestionsList.classList.remove('hidden');
        });

        input.addEventListener('input', () => {
            populateSuggestions(input, suggestionsList);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar') && !e.target.closest('.mobile-search-bar')) {
                suggestionsList.classList.add('hidden');
            }
        });
    });

    // Adiciona eventos para cada botão de pesquisa
    searchButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            navigateToSection(searchInputs[index]);
        });
    });
}
