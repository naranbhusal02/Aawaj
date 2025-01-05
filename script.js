document.addEventListener('DOMContentLoaded', () => {
    // Carousel elements
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stations = document.querySelectorAll('.station-container');
    let currentIndex = 0;

    // Carousel navigation
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + stations.length) % stations.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % stations.length;
        updateCarousel();
    });

    // Radio player functionality
    stations.forEach(station => {
        const playPauseBtn = station.querySelector('.play-pause-btn');
        const playPauseIcon = playPauseBtn.querySelector('i');
        const volumeSlider = station.querySelector('.volume-slider');
        const volumeIcon = station.querySelector('.volume-icon');
        const albumArt = station.querySelector('.album-art');
        const audioWaves = station.querySelector('.audio-waves');
        const currentTimeDisplay = station.querySelector('.current-time');
        const radioPlayer = station.querySelector('.radio-player');

        let isPlaying = false;

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                radioPlayer.pause();
            } else {
                // Pause all other stations
                stations.forEach(otherStation => {
                    if (otherStation !== station) {
                        const otherPlayer = otherStation.querySelector('.radio-player');
                        otherPlayer.pause();
                        updatePlayerState(otherStation, false);
                    }
                });

                radioPlayer.play().catch(error => handlePlayError(station, error));
            }
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            radioPlayer.volume = volume;
            updateVolumeIcon(volumeIcon, volume);
        });

        // Audio event handlers
        radioPlayer.addEventListener('playing', () => {
            isPlaying = true;
            updatePlayerState(station, true);
        });

        radioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            updatePlayerState(station, false);
        });

        radioPlayer.addEventListener('error', (error) => handlePlayError(station, error));

        // Update current time
        function updateCurrentTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            currentTimeDisplay.textContent = timeString;
        }

        // Update time every second
        setInterval(updateCurrentTime, 1000);
        updateCurrentTime(); // Initial update

        // Volume icon click to mute/unmute
        let previousVolume = 1;
        volumeIcon.addEventListener('click', () => {
            if (radioPlayer.volume > 0) {
                previousVolume = radioPlayer.volume;
                radioPlayer.volume = 0;
                volumeSlider.value = 0;
            } else {
                radioPlayer.volume = previousVolume;
                volumeSlider.value = previousVolume;
            }
            updateVolumeIcon(volumeIcon, radioPlayer.volume);
        });
    });

    // Update player state (play/pause, animations)
    function updatePlayerState(station, isPlaying) {
        const playPauseBtn = station.querySelector('.play-pause-btn');
        const playPauseIcon = playPauseBtn.querySelector('i');
        const albumArt = station.querySelector('.album-art');
        const audioWaves = station.querySelector('.audio-waves');

        if (isPlaying) {
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
            albumArt.classList.add('rotating', 'playing');
            audioWaves.classList.add('active');
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
            albumArt.classList.remove('rotating', 'playing');
            audioWaves.classList.remove('active');
        }
    }

    // Handle play errors
    function handlePlayError(station, error) {
        console.error('Error playing the radio stream:', error);

        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = 'Error playing the radio stream. Please try again later.';
        station.appendChild(errorMessage);

        updatePlayerState(station, false);

        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

    // Update volume icon based on volume level
    function updateVolumeIcon(volumeIcon, volume) {
        volumeIcon.className = 'fas';
        if (volume === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (volume < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});