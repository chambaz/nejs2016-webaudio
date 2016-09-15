const Reveal = require('reveal.js');

Reveal.initialize({
	history: true,
    dependencies: [
        // Syntax highlight for <code> elements
        { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    ]
});

// create web audio context
const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// create analyzer node
const analyser = audioCtx.createAnalyser();

// set size of fast fourier transform
analyser.fftSize = 32;

// construct Uint8Array for analysis data
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const logo = document.querySelector('[data-logo]');

// get user microphone
navigator.mediaDevices.getUserMedia({
	audio: true,
}).then(stream => {
	// create media stream from mic input and connect to analyzer
	const mediaStream = audioCtx.createMediaStreamSource(stream);
	mediaStream.connect(analyser);

	// kick off analysis
	requestAnimationFrame(analyze);
});

// call analyze function at 60fps
function analyze() {
	// get frequency data of audio at this point in time
	analyser.getByteFrequencyData(dataArray);
	const scale = dataArray[10] / 60;

	if (scale > 1) {
		logo.style.transform = `scale(${scale})`;
	}

	// recursivly call function every 60fps
	requestAnimationFrame(analyze);
}
