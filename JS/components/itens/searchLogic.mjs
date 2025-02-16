export function initializeSearch(searchInputs, searchButtons, suggestionsLists, mobileMenu) {
    const sections = [
        { label: 'inicio', sectionId: '1' },
        { label: 'animes', sectionId: '2' },
        { label: 'mapas', sectionId: 'mapas' },
        { label: 'carros', sectionId: 'carros' },
        { label: 'contato', sectionId: 'contact' },
        { label: 'forums', sectionId: 'comunidade' },
        { label: 'cultura', sectionId: 'cultura' }
    ];

    function navigateToSection(input) {
        const userInput = input.value.trim().toLowerCase();
        const targetSection = sections.find(section => section.label === userInput);

        if (targetSection) {
            document.getElementById(targetSection.sectionId).scrollIntoView({ behavior: 'smooth' });

            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        } else {
            alert('Seção não encontrada. Tente novamente!');
        }
    }

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
                });
                suggestionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma sugestão encontrada';
            li.style.color = '#ff2626';
            suggestionsList.appendChild(li);
        }
    }

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

    searchButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            navigateToSection(searchInputs[index]);
        });
    });
}