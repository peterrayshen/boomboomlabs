// Loads all of the audio samples.
const samples = {
    "hh" : "./sounds/hh.[mp3|ogg]",
    "hho" : "./sounds/hho.[mp3|ogg]",
    "kick" : "./sounds/kick.[mp3|ogg]",
    "snare" : "./sounds/snare.[mp3|ogg]"
};
const keys = new Tone.Players(samples, {"volume" : -10}).toMaster();
const noteNames = Object.keys(samples);

let loop, loop2;

function createMainLoop() {
    Tone.Transport.cancel();

    // Runs the loop for the step sequencer.
    loop = new Tone.Sequence(function(time, col) {
        const currentColumn = document.querySelector("step-sequencer").currentColumn;
    
        // Plays notes for each column.
        currentColumn.forEach(function(val, i) {
            if (val) {
                keys.get(noteNames[i]) // Gets the appropriate url from keys passed-in object above. Returns Tone.Player (an audio file).
                    .start(time, 0, '32n'); // Plays the audio file for a duration '32n'.
            }
        });
        
        Tone.Draw.schedule(function(){
            document.querySelector("step-sequencer").setAttribute("highlight", col);
        }, time);
    
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n").start(0);
}

function createSecondaryLoop(soundName, row) {
    Tone.Transport.cancel();

    loop2 = new Tone.Sequence(function(time, col) {        
        if (row[col]) {
            keys.get(soundName).start(time, 0, '32n');
        }

        Tone.Draw.schedule(function(){
            document.querySelector("step-sequencer").setAttribute("highlight", col);
        }, time);
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start(0);
}

// Use Tone.Transport methods to run events on playback and stop.
// Use Tone.Transport members to get meta-data (i.e. use Tone.Transport.seconds for timing).
Tone.Transport.on("stop", () => {
    setTimeout(() => {
        document.querySelector("step-sequencer").setAttribute("highlight", "-1");
    }, 100);
});

const mainControl = document.querySelector(".start");
mainControl.addEventListener('click', () => {
    createMainLoop();
    Tone.Transport.toggle();
    mainControl.innerHTML = mainControl.innerHTML === 'Start' ? 'Stop' : 'Start';
});

const popup = document.querySelector('.pop-up');

document.querySelector('.show-pop-up').addEventListener('click', () => {
    Tone.Transport.cancel();
    popup.style.display = 'block';
});

document.querySelector('.close-pop-up').addEventListener('click', () => {
    Tone.Transport.cancel();
    popup.style.display = 'none';
});



const sequencer = document.querySelector('step-sequencer');



const soundset = document.querySelector('sound-set');
soundset.data = ['1010101010100100', '1111111100011111', '000100010000100', '1000100011010101', '0000000111100010'];
soundset.callback = function (param) {
    console.log(param);
}


setTimeout(() => {sequencer.updateValues('1010100010111010', 1)}, 3000);