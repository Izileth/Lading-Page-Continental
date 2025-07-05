class MusicPlayer {
    static players = []; // Lista global para gerenciar todos os players

    constructor(playerId, playlist) {
        this.player = document.getElementById(playerId);
        this.audio = this.player.querySelector("audio");
        this.playPauseBtn = this.player.querySelector(".playPause");
        this.progressBar = this.player.querySelector(".progress");
        this.timeDisplay = this.player.querySelector(".time");
        this.nextBtn = this.player.querySelector(".next");
        this.prevBtn = this.player.querySelector(".prev");

        this.playlist = playlist; // Usa os links do Google Drive diretamente
        this.currentTrack = 0;

        this.loadTrack(this.currentTrack, false);

        // Adiciona este player à lista global
        MusicPlayer.players.push(this);

        // Eventos
        this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
        this.audio.addEventListener("timeupdate", () => this.updateProgress());
        this.progressBar.addEventListener("input", () => this.seekAudio());
        this.nextBtn.addEventListener("click", () => this.nextTrack());
        this.prevBtn.addEventListener("click", () => this.prevTrack());
        this.audio.addEventListener("ended", () => this.nextTrack());
    }

    loadTrack(trackIndex, autoplay = true) {
        this.audio.src = this.playlist[trackIndex];
        this.audio.load();
        if (autoplay) this.play();
    }

    play() {
        // Para todos os outros players antes de tocar este
        MusicPlayer.players.forEach(player => {
            if (player !== this) player.pause();
        });

        this.audio.play();
        this.playPauseBtn.textContent = "⏸";
    }

    pause() {
        this.audio.pause();
        this.playPauseBtn.textContent = "▶";
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    updateProgress() {
        this.progressBar.value = this.audio.currentTime;
        this.timeDisplay.textContent = `${this.formatTime(this.audio.currentTime)} / ${this.formatTime(this.audio.duration)}`;
    }

    seekAudio() {
        this.audio.currentTime = this.progressBar.value;
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
    }

    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
    }

    formatTime(time) {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" + sec : sec}`;
    }
}

// Inicializar múltiplos players
const player1 = new MusicPlayer("player1", [
    "./assets/music/DRIFTBOYS - Canadá (Gakkou).mp3",
    "./assets/music/DRIFTBOYS_-_kami_(prod._By_Tan)_[_YouConvert.net_].mp3",
    "./assets/music/DRIFTBOYS_-_Power_Slide_(Dir._sp.celes)_[_YouConvert.net_].mp3",
    "./assets/music/Six_Days_(Lyrics)_-_Tokyo_Drift_its_only_monday_[_YouConvert.net_].mp3",
]);


const player2 = new MusicPlayer("player2", [
    "./assets/music/Six_Days_(Lyrics)_-_Tokyo_Drift_its_only_monday_[_YouConvert.net_].mp3",
    "./assets/music/DRIFTBOYS_-_kami_(prod._By_Tan)_[_YouConvert.net_].mp3",
    "./assets/music/DRIFTBOYS - Canadá (Gakkou).mp3",
    "./assets/music/DRIFTBOYS_-_Power_Slide_(Dir._sp.celes)_[_YouConvert.net_].mp3",
]);

const player3 = new MusicPlayer("player3", [
    "./assets/music/DRIFTBOYS_-_Power_Slide_(Dir._sp.celes)_[_YouConvert.net_].mp3",
    "./assets/music/DRIFTBOYS - Canadá (Gakkou).mp3",
    "./assets/music/DRIFTBOYS_-_kami_(prod._By_Tan)_[_YouConvert.net_].mp3",
    "./assets/music/Six_Days_(Lyrics)_-_Tokyo_Drift_its_only_monday_[_YouConvert.net_].mp3",
]);


const player4= new MusicPlayer("player4", [
    "./assets/music/DRIFTBOYS_-_Power_Slide_(Dir._sp.celes)_[_YouConvert.net_].mp3",
    "./assets/music/DRIFTBOYS - Canadá (Gakkou).mp3",
    "./assets/music/DRIFTBOYS_-_kami_(prod._By_Tan)_[_YouConvert.net_].mp3",
    "./assets/music/Six_Days_(Lyrics)_-_Tokyo_Drift_its_only_monday_[_YouConvert.net_].mp3",
]);

