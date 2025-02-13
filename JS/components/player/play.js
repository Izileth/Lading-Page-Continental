class MusicPlayer {
    constructor(playerId, playlist) {
        this.player = document.getElementById(playerId);
        this.audio = this.player.querySelector("audio");
        this.playPauseBtn = this.player.querySelector(".playPause");
        this.progressBar = this.player.querySelector(".progress");
        this.timeDisplay = this.player.querySelector(".time");
        this.nextBtn = this.player.querySelector(".next");
        this.prevBtn = this.player.querySelector(".prev");

        this.playlist = playlist;
        this.currentTrack = 0;

        // Carregar primeira faixa
        this.loadTrack(this.currentTrack);

        // Eventos
        this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
        this.audio.addEventListener("timeupdate", () => this.updateProgress());
        this.progressBar.addEventListener("input", () => this.seekAudio());
        this.nextBtn.addEventListener("click", () => this.nextTrack());
        this.prevBtn.addEventListener("click", () => this.prevTrack());
    }

    loadTrack(trackIndex) {
        this.audio.src = this.playlist[trackIndex];
        this.audio.load();
        this.audio.play();
        this.playPauseBtn.textContent = "⏸";
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.textContent = "⏸";
        } else {
            this.audio.pause();
            this.playPauseBtn.textContent = "▶";
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

// Inicializar múltiplos players com IDs e playlists diferentes
const player1 = new MusicPlayer("player1", [
    "./assets/music/DRIFTBOYS - Canadá (Gakkou).mp3",
    "./assets/music/Song2.mp3",
    "./assets/music/Song3.mp3"
]);

const player2 = new MusicPlayer("player2", [
    "./assets/music/DRIFTBOYS_-_kami_(prod._By_Tan)_[_YouConvert.net_].mp3",
    "./assets/music/OtherSong2.mp3",
    "./assets/music/OtherSong3.mp3"
]);

const player3 = new MusicPlayer("player3", [
    "./assets/music/DRIFTBOYS_-_Power_Slide_(Dir._sp.celes)_[_YouConvert.net_].mp3",
    "./assets/music/OtherSong2.mp3",
    "./assets/music/OtherSong3.mp3"
]);


const player4= new MusicPlayer("player4", [
    "./assets/music/Six_Days_(Lyrics)_-_Tokyo_Drift_its_only_monday_[_YouConvert.net_].mp3",
    "./assets/music/OtherSong2.mp3",
    "./assets/music/OtherSong3.mp3"
]);

