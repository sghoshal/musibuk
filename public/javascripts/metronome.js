var metronomeStarted = false;
var Dilla = require('dilla');
    var Context = window.AudioContext || window.webkitAudioContext;

    var audioContext = new Context();

    var dilla = new Dilla(audioContext, {
        "tempo": 120,
        "beatsPerBar": 4,
        "loopLength": 2
    });

$("#metronome-play").click(function() {
    console.log("Metronome Play clicked!");
    console.log("Metronome value: %s", metronomeStarted);
    if(!metronomeStarted) {
        startMetronome();
        metronomeStarted = true;
    }
});

$("#metronome-pause").click(function() {
    console.log("Metronome Pause clicked!")
    dilla.stop();
    metronomeStarted = false;
    console.log("Metronome value: %s", metronomeStarted);
});

function startMetronome() {
    console.log("Start Metronome method");

    var high = {
      'position': '*.1.01',
      'freq': 440,
      'duration': 15
    };
    var low = { 'freq': 330, 'duration': 15 };
     
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
     
    dilla.start();
} 
