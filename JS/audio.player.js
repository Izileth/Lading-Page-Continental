document.addEventListener('DOMContentLoaded', function() {
    // Configuração dos áudios - SOLUÇÕES ALTERNATIVAS PARA CORS
    const audioElements = {
      // Músicas JDM
        'Power Slide': {
            src: '/audio/DRIFTBOYS_1.mp3',
            artist: 'DRIFTBOYS',
            cover: '🎶',
            duration: '3:42',
            type: 'music'
        },
        'Kami': {
            src: '/audio/DRIFTBOYS_2.mp3',
            artist: 'DRIFTBOYS',
            cover: '🎵',
            duration: '3:15',
            type: 'music'
        },
        'Six Days': {
            src: '/audio/SIX_DAYS.mp3',
            artist: 'Lyrics',
            cover: '📻',
            duration: '4:26',
            type: 'music'
        },
        'Anikdote': {
            src: '/audio/DRIFT_MUSIC.mp3',
            artist: 'Philosophy',
            cover: '🎧',
            duration: '3:24',
            type: 'music'
        },
    };


    

    // Função para converter ID do Google Drive para URL com proxy
    function getGoogleDriveUrl(fileId) {
        // Método 1: AllOrigins (gratuito, mas pode ser lento)
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://drive.google.com/uc?export=download&id=${fileId}`)}`;
        
        // Método 2: CORS Anywhere (requer ativação manual)
        // return `https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=${fileId}`;
        
        // Método 3: Seu próprio proxy (recomendado para produção)
        // return `https://seu-servidor.com/proxy?url=https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // Função para obter URL do áudio (suporta múltiplos formatos)
    function getAudioUrl(audioData) {
        // Se tem src direto, usa ele
        if (audioData.src) {
            return audioData.src;
        }
        
        // Se tem ID do Google Drive, usa o proxy
        if (audioData.id) {
            return getGoogleDriveUrl(audioData.id);
        }
        
        // Fallback
        return null;
    }

    // Elementos do DOM
    const globalPlayer = document.getElementById('globalPlayer');
    const currentTitle = document.getElementById('currentTitle');
    const currentArtist = document.getElementById('currentArtist');
    const currentCover = document.getElementById('currentCover');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');
    const volumeContainer = document.getElementById('volumeContainer');
    const loadingIndicator = document.getElementById('loadingIndicator'); // Novo elemento para loading
    
    // Estado do player
    const audio = new Audio();
    let currentTrack = null;
    let isPlaying = false;
    let playlist = [];
    let currentIndex = 0;
    let isDragging = false;
    let isLoading = false;
    let loadRetries = 0;
    const maxRetries = 3;
    
    // Configuração de erro handling aprimorada
    const errorCodes = {
        MEDIA_ERR_ABORTED: 'Carregamento cancelado',
        MEDIA_ERR_NETWORK: 'Erro de rede',
        MEDIA_ERR_DECODE: 'Erro de decodificação',
        MEDIA_ERR_SRC_NOT_SUPPORTED: 'Formato não suportado'
    };
    
    // Inicialização
    function init() {
        try {
            // Configurações do audio
            audio.preload = 'none';
            audio.crossOrigin = 'anonymous';
            
            // Cria playlist com todas as músicas
            playlist = Object.keys(audioElements);
            
            // Configura event listeners
            setupEventListeners();
            
            // Volume inicial
            audio.volume = 0.8;
            updateVolumeBar();
            
            // Log inicial
            console.log('JDM Player inicializado com', playlist.length, 'faixas');
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
            showError('Erro ao inicializar o player');
        }
    }
    
    // Configurar todos os event listeners
    function setupEventListeners() {
        // Event listeners para os itens clicáveis
        document.querySelectorAll('[data-audio]').forEach(item => {
            const title = item.getAttribute('data-audio');
            
            // Adiciona evento de clique no item
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('play-btn')) {
                    return;
                }
                playTrack(title);
            });
            
            // Adiciona evento específico para os botões de play
            const playBtn = item.querySelector('.play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    playTrack(title);
                });
            }
        });
        
        // Controles do player
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', playPrevious);
        nextBtn.addEventListener('click', playNext);
        
        // Event listeners do áudio com tratamento de erro aprimorado
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        
        // Barra de progresso
        setupProgressBar();
        
        // Controle de volume
        setupVolumeControl();
        
        // Atalhos de teclado
        setupKeyboardShortcuts();
    }
    
    // Handlers de evento do áudio
    function handleLoadStart() {
        console.log('Carregando áudio...');
        showLoading(true);
        isLoading = true;
    }
    
    function handleLoadedMetadata() {
        console.log('Metadata carregada');
        updateDuration();
        showLoading(false);
    }
    
    function handleCanPlay() {
        console.log('Áudio pronto para reproduzir');
        updateDuration();
        showLoading(false);
        isLoading = false;
        loadRetries = 0; // Reset retries on success
    }
    
    function handleCanPlayThrough() {
        console.log('Áudio totalmente carregado');
        showLoading(false);
        isLoading = false;
    }
    
    function handleTimeUpdate() {
        if (!isDragging) {
            updateProgress();
        }
    }
    
    function handleEnded() {
        console.log('Áudio terminou');
        playNext();
    }
    
    function handleError(e) {
        console.error('Erro no áudio:', e);
        showLoading(false);
        isLoading = false;
        
        const errorType = audio.error ? errorCodes[audio.error.code] || 'Erro desconhecido' : 'Erro de carregamento';
        console.error('Tipo do erro:', errorType);
        
        // Tenta novamente se não excedeu o limite
        if (loadRetries < maxRetries) {
            loadRetries++;
            console.log(`Tentativa ${loadRetries}/${maxRetries} para: ${currentTrack}`);
            setTimeout(() => {
                retryLoad();
            }, 1000 * loadRetries); // Delay progressivo
        } else {
            console.error('Máximo de tentativas excedido para:', currentTrack);
            showError(`Erro ao carregar "${currentTrack}". Verificar se o arquivo está compartilhado publicamente.`);
            playNext();
        }
    }
    
    function handlePlay() {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        updatePlayingState();
        console.log('Reproduzindo:', currentTrack);
    }
    
    function handlePause() {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        updatePlayingState();
        console.log('Pausado:', currentTrack);
    }
    
    function handleWaiting() {
        console.log('Aguardando dados...');
        showLoading(true);
    }
    
    // Configurar barra de progresso
    function setupProgressBar() {
        let isProgressDragging = false;
        
        progressContainer.addEventListener('mousedown', (e) => {
            isProgressDragging = true;
            isDragging = true;
            updateProgressByClick(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isProgressDragging) {
                updateProgressByClick(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isProgressDragging = false;
            isDragging = false;
        });
        
        progressContainer.addEventListener('click', (e) => {
            if (!isProgressDragging) {
                updateProgressByClick(e);
            }
        });
    }
    
    // Configurar controle de volume
    function setupVolumeControl() {
        let isVolumeDragging = false;
        
        volumeContainer.addEventListener('mousedown', (e) => {
            isVolumeDragging = true;
            updateVolumeByClick(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isVolumeDragging) {
                updateVolumeByClick(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isVolumeDragging = false;
        });
        
        volumeContainer.addEventListener('click', (e) => {
            if (!isVolumeDragging) {
                updateVolumeByClick(e);
            }
        });
    }
    
    // Configurar atalhos de teclado
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Só funciona se não estiver em um input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.code) {
                case 'Space':
                    if (currentTrack) {
                        e.preventDefault();
                        togglePlayPause();
                    }
                    break;
                case 'ArrowLeft':
                    if (currentTrack) {
                        e.preventDefault();
                        playPrevious();
                    }
                    break;
                case 'ArrowRight':
                    if (currentTrack) {
                        e.preventDefault();
                        playNext();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    adjustVolume(0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    adjustVolume(-0.1);
                    break;
            }
        });
    }
    
    // Tocar uma faixa específica
    function playTrack(title) {
        console.log('Tentando tocar:', title);
        
        if (!audioElements[title]) {
            console.error('Áudio não encontrado:', title);
            showError(`Faixa "${title}" não encontrada`);
            return;
        }
        
        // Pausa áudio atual se estiver tocando
        if (currentTrack && !audio.paused) {
            audio.pause();
        }
        
        // Reset do estado
        currentTrack = title;
        currentIndex = playlist.indexOf(title);
        loadRetries = 0;
        
        // Carrega novo áudio
        const audioData = audioElements[title];
        const audioUrl = getAudioUrl(audioData);
        
        if (!audioUrl) {
            console.error('URL do áudio não encontrada:', title);
            showError(`URL não encontrada para "${title}"`);
            return;
        }
        
        console.log('URL do áudio:', audioUrl);
        
        audio.src = audioUrl;
        audio.load();
        
        // Atualizar UI imediatamente
        updateTrackInfo(title);
        
        // Mostrar player
        showPlayer();
        
        // Tentar reproduzir
        tryPlay();
    }
    
    // Atualizar informações da faixa na UI
    function updateTrackInfo(title) {
        const audioData = audioElements[title];
        currentTitle.textContent = title;
        currentArtist.textContent = audioData.artist;
        currentCover.textContent = audioData.cover;
        
        // Resetar controles
        progressBar.style.width = '0%';
        currentTime.textContent = '0:00';
        duration.textContent = audioData.duration;
        
        // Atualizar estado visual dos botões
        updatePlayingState();
    }
    
    // Mostrar player com animação
    function showPlayer() {
        if (globalPlayer.classList.contains('hidden')) {
            globalPlayer.classList.remove('hidden');
            setTimeout(() => {
                globalPlayer.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    // Tentar reproduzir com tratamento de erro
    function tryPlay() {
        showLoading(true);
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Reprodução iniciada com sucesso');
                    showLoading(false);
                })
                .catch(error => {
                    console.error('Erro ao reproduzir:', error);
                    showLoading(false);
                    
                    // Se é erro de interação do usuário, mostra mensagem específica
                    if (error.name === 'NotAllowedError') {
                        showError('Clique no botão play para iniciar a reprodução');
                    }
                });
        }
    }
    
    // Tentar recarregar o áudio
    function retryLoad() {
        if (currentTrack) {
            console.log('Tentando recarregar:', currentTrack);
            const audioData = audioElements[currentTrack];
            const audioUrl = getAudioUrl(audioData);
            
            if (audioUrl) {
                audio.src = audioUrl;
                audio.load();
                
                // Tenta reproduzir novamente se estava tocando
                if (isPlaying) {
                    tryPlay();
                }
            }
        }
    }
    
    // Alternar play/pause
    function togglePlayPause() {
        if (!currentTrack) {
            playTrack(playlist[0]);
            return;
        }
        
        if (isLoading) {
            console.log('Aguardando carregamento...');
            return;
        }
        
        if (isPlaying) {
            audio.pause();
        } else {
            tryPlay();
        }
    }
    
    // Próxima faixa
    function playNext() {
        if (playlist.length === 0) return;
        
        currentIndex = (currentIndex + 1) % playlist.length;
        playTrack(playlist[currentIndex]);
    }
    
    // Faixa anterior
    function playPrevious() {
        if (playlist.length === 0) return;
        
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playTrack(playlist[currentIndex]);
    }
    
    // Atualizar barra de progresso
    function updateProgress() {
        if (!audio.duration || isNaN(audio.duration)) return;
        
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTime.textContent = formatTime(audio.currentTime);
    }
    
    // Atualizar progresso por clique
    function updateProgressByClick(e) {
        if (!audio.duration || isLoading) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = pos * audio.duration;
        
        audio.currentTime = newTime;
        progressBar.style.width = `${pos * 100}%`;
        currentTime.textContent = formatTime(newTime);
    }
    
    // Atualizar volume por clique
    function updateVolumeByClick(e) {
        const rect = volumeContainer.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = pos;
        updateVolumeBar();
    }
    
    // Ajustar volume
    function adjustVolume(delta) {
        const newVolume = Math.max(0, Math.min(1, audio.volume + delta));
        audio.volume = newVolume;
        updateVolumeBar();
    }
    
    // Atualizar barra de volume
    function updateVolumeBar() {
        volumeBar.style.width = `${audio.volume * 100}%`;
    }
    
    // Atualizar duração
    function updateDuration() {
        if (audio.duration && !isNaN(audio.duration)) {
            duration.textContent = formatTime(audio.duration);
        } else if (currentTrack && audioElements[currentTrack]) {
            duration.textContent = audioElements[currentTrack].duration;
        }
    }
    
    // Atualizar estado visual dos elementos
    function updatePlayingState() {
        // Remover classe 'playing' de todos os itens
        document.querySelectorAll('[data-audio]').forEach(item => {
            item.classList.remove('playing');
        });
        
        // Adicionar classe 'playing' ao item atual
        if (currentTrack) {
            const currentItem = document.querySelector(`[data-audio="${currentTrack}"]`);
            if (currentItem) {
                currentItem.classList.add('playing');
            }
        }
    }
    
    // Mostrar/ocultar loading
    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
        
        // Disable controls durante loading
        playPauseBtn.disabled = show;
        prevBtn.disabled = show;
        nextBtn.disabled = show;
    }
    
    // Mostrar erro
    function showError(message) {
        console.error(message);
        
        // Cria notification de erro temporária
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            color: #000;
            padding: 12px 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove após 5 segundos
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 5000);
    }
    
    // Formatar tempo (mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Função para adicionar nova faixa dinamicamente
    function addTrack(title, id, artist, cover, duration, type = 'music') {
        audioElements[title] = {
            id: id,
            artist: artist,
            cover: cover,
            duration: duration,
            type: type
        };
        
        playlist.push(title);
        console.log('Nova faixa adicionada:', title);
    }
    
    // Função para remover faixa
    function removeTrack(title) {
        if (audioElements[title]) {
            delete audioElements[title];
            playlist = playlist.filter(track => track !== title);
            
            // Se estava tocando a faixa removida, para
            if (currentTrack === title) {
                audio.pause();
                currentTrack = null;
            }
            
            console.log('Faixa removida:', title);
        }
    }
    
    // Função para obter informações de uma faixa
    function getTrackInfo(title) {
        return audioElements[title] || null;
    }
    
    // Função para obter playlist atual
    function getPlaylist() {
        return playlist.slice(); // Retorna cópia
    }
    
    // Função para shuffle playlist
    function shufflePlaylist() {
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        console.log('Playlist embaralhada');
    }
    
    // Adicionar CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .playing {
            background: rgba(255, 255, 255, 0.1);
            border-left: 3px solid #ddd;
        }
        
        .error-notification {
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar o player
    init();
    
    // Expor funções úteis globalmente para debug/extensão
    window.JDMPlayer = {
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        addTrack,
        removeTrack,
        getTrackInfo,
        getPlaylist,
        shufflePlaylist,
        getCurrentTrack: () => currentTrack,
        isPlaying: () => isPlaying,
        setVolume: (vol) => {
            audio.volume = Math.max(0, Math.min(1, vol));
            updateVolumeBar();
        },
        getVolume: () => audio.volume
    };
    
    // Log final
    console.log('🎵 JDM Player v2.0 inicializado com sucesso!');
    console.log('💡 Dica: Use window.JDMPlayer para acessar funções do player');
    console.log('📁 Lembre-se de substituir os IDs dos arquivos do Google Drive');
});


