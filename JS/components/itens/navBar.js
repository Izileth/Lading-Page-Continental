const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
    } else {
        mobileMenu.classList.add('open');
    }
});