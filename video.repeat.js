document.addEventListener('DOMContentLoaded', function() {
  // Elementos do vídeo de fundo
  const bgVideo = document.getElementById('backgroundVideo');
  const playPauseBgBtn = document.getElementById('playPauseBgBtn');
  const muteBgBtn = document.getElementById('muteBgBtn');
  const videoControlBtn = document.getElementById('videoControlBtn');

  // Configuração inicial
  let isBgPlaying = true;
  
  // Carregar vídeo (substitua pela sua URL)
  function loadBackgroundVideo(videoUrl) {
    bgVideo.src = videoUrl;
    bgVideo.load();
    
    // Configura o vídeo para autoplay em loop
    bgVideo.addEventListener('loadedmetadata', function() {
      bgVideo.play();
      isBgPlaying = true;
    });
  }

  // Controles de play/pause
  playPauseBgBtn.addEventListener('click', function() {
    if (isBgPlaying) {
      bgVideo.pause();
    } else {
      bgVideo.play();
    }
    isBgPlaying = !isBgPlaying;
  });

  // Controles de mute/unmute
  muteBgBtn.addEventListener('click', function() {
    bgVideo.muted = !bgVideo.muted;
  });

  // Opcional: Efeitos para o vídeo de fundo
  const videoEffects = {
    applyEffect: function(effectName) {
      // Remove todas as classes de efeito primeiro
      bgVideo.className = "w-full h-full object-cover opacity-70";
      
      switch(effectName) {
        case 'vintage':
          bgVideo.classList.add('filter', 'sepia-50', 'contrast-120', 'brightness-110', 'saturate-130');
          break;
        case 'black-white':
          bgVideo.classList.add('filter', 'grayscale', 'contrast-120');
          break;
        case 'dramatic':
          bgVideo.classList.add('filter', 'contrast-150', 'brightness-80', 'saturate-180');
          break;
        // Adicione mais efeitos conforme necessário
        default:
          // Sem efeito adicional
      }
    }
  };

  // Carrega o vídeo (substitua pela sua URL)
  loadBackgroundVideo('https://v1.pinimg.com/videos/mc/720p/d0/23/02/d0230262f420b7e32d32894e2dec4372.mp4');

  // Exemplo: Para aplicar um efeito
  // videoEffects.applyEffect('vintage');
});