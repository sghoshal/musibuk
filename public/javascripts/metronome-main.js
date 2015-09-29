
var Dilla = require('dilla');
var audioContext = new AudioContext();
var dilla = new Dilla(audioContext);

var high = {
  'position': '*.1.01',
  'freq': 440,
  'duration': 2
};
var low = { 'freq': 330, 'duration': 2 };

dilla.set('metronome', [
  high,
  ['*.2.01', low],
  ['*.3.01', low],
  ['*.4.01', low]
]);

var oscillator, gainNode;

dilla.on('step', function (step) {
  if (step.event === 'start') {
    oscillator = step.context.createOscillator();
    gainNode = step.context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(step.context.destination);
    oscillator.frequency.value = step.args.freq;
    gainNode.gain.setValueAtTime(1, step.time);
    oscillator.start(step.time);
  }
  else if (step.event === 'stop' && oscillator) {
    gainNode.gain.setValueAtTime(1, step.time);
    gainNode.gain.linearRampToValueAtTime(0, step.time + 0.1);
    oscillator.stop(step.time + 0.1);
    oscillator = null;
    gainNode = null;
  }
});

$("#btn-metronome-start").click(function(event) {
    var currentBpmTempo = $("#currentBpmVal").text();
    console.log("Current Tempo: %s", currentBpmTempo);

    dilla.setTempo(parseInt(currentBpmTempo));
    console.log("Metronome start button clicked");
    
    dilla.start();
});

$("#btn-metronome-stop").click(function(event) {
    console.log("Metronome stop button clicked");
    dilla.stop();
});