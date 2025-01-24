// Objeto com IDs como chaves e URLs como valores
const buttonActions = {
    buttonRedirect: 'https://manifestoriental.netlify.app',
    buttonRight:  'https://novocidente.netlify.app/',
    buttonAbout: 'https://example.com/about'
};

// Adiciona os eventos de clique com redirecionamentos personalizados
Object.keys(buttonActions).forEach(id => {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', () => {
            window.location.href = buttonActions[id];
        });
    }
});
