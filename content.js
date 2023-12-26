class AudioNormalizer {

    static CachedURL = "InsertRickRoll";
    static Instance = null;
    static gainNode = null;

    static initialize() {
        const audioCtx = new AudioContext();

        this.gainNode = audioCtx.createGain();
        this.gainNode.connect(audioCtx.destination);

        const videoElement = document.querySelector('video');
        const source = audioCtx.createMediaElementSource(videoElement);

        source.connect(this.gainNode);
    }

    static getVolume(panel) {
        const volumeLabel = panel.childNodes[1].childNodes[3].innerHTML;
        const volume = parseFloat(volumeLabel.split('loudness')[1].split('dB')[0]);

        if (volume >= 0.0)
            return 1.0;
        else
            return Math.pow(10, Math.abs(volume) / 20);
    }

    constructor(url) {
        this.succeeded = false;

        AudioNormalizer.CachedURL = url;
        if (AudioNormalizer.gainNode === null)
            AudioNormalizer.initialize();

        AudioNormalizer.gainNode.gain.value = 1.0;
    }

    tryNormalize() {
        if (this.succeeded)
            return;

        const panel = document.querySelector('.html5-video-info-panel');

        if (panel === null)
            return;

        const increase = AudioNormalizer.getVolume(panel);
        AudioNormalizer.gainNode.gain.value = increase;

        console.log('Normalized Volume by ' + increase.toFixed(2) + ' dB');

        this.succeeded = true;
    }

}

document.addEventListener('click', () => {

    if (AudioNormalizer.CachedURL !== window.location.href)
        AudioNormalizer.Instance = new AudioNormalizer(window.location.href);

    AudioNormalizer.Instance.tryNormalize();

});
