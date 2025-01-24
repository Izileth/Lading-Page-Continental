const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuLinks = mobileMenu.querySelectorAll('a'); // Seleciona todos os links dentro do menu móvel

// Alternar o menu ao clicar no botão de hambúrguer
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Fechar o menu ao clicar em qualquer link
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});