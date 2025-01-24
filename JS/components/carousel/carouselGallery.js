(function () {
    const track = document.querySelector('.carousel-track-gallery');
    const items = document.querySelectorAll(' .carousel-item-gallery');
    const indicators = document.querySelectorAll(' .carousel-indicators-gallery div');
  
    let currentIndex = 0;
  
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
  
    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }
  
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
  
    setInterval(goToNextSlide, 4000); // 4 segundos entre transições

})();    
  