/*
 * @name Song
 * @frame 720, 430
 * @description Play a song.
 * You will need to include the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound
 * library</a> for this example to work in your own project.
 */
// The midi notes of a scale
let notes = [ 60, 62, 64, 65, 67];
let value = 100;

// dropdowns for ranking sounds
let sel1;

// For automatically playing the song
let index = 0;
let song = [
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 200, display: "G" },
  { note: 1, duration: 200, display: "A" },
  { note: 2, duration: 200, display: "B" },
  { note: 3, duration: 200, display: "C" },
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 400, display: "G" },
  { note: 0, duration: 400, display: "G" }
];

var songs = ['lucky_dragons_-_power_melody.mp3','Siren Song (From Siren).wav',];
var sounds = [];

var items = [];

let trigger = 0;
let autoplay = false;
let osc;

function preload() {
  // song file
  for(let i = 0; i<songs.length;i++){
  sounds[i] = loadSound(songs[i]); 
 }
}

function setup() {
  createCanvas(720, 400);
  let div = createDiv("Click to play notes or ")
  div.id("instructions");
  let button = createButton("play song automatically.");
  button.parent("instructions");
  // Trigger automatically playing
  button.mousePressed(function() {
    if (!autoplay) {
      index = 0;
      autoplay = true;
    }
  });
  
  // declare dropdowns
  sel1 = createSelect();
  //sel.position(10, 10);
  sel1.option('1');
  sel1.option('2');
  sel1.option('3');
  sel1.option('4');
  sel1.option('5');
  sel1.selected('1');
  sel1.changed(mySelectEvent);
  

  sel2 = createSelect();
  //sel.position(10, 10);
  sel2.option('1');
  sel2.option('2');
  sel2.option('3');
  sel2.option('4');
  sel2.option('5');
  sel2.selected('1');
  sel2.changed(mySelectEvent);
  
  sel3 = createSelect();
  //sel.position(10, 10);
  sel3.option('1');
  sel3.option('2');
  sel3.option('3');
  sel3.option('4');
  sel3.option('5');
  sel3.selected('1');
  sel3.changed(mySelectEvent);
  
  sel4 = createSelect();
  sel4.option('1');
  sel4.option('2');
  sel4.option('3');
  sel4.option('4');
  sel4.option('5');
  sel4.selected('1');
  sel4.changed(mySelectEvent);
  
  sel5 = createSelect();
  //sel.position(10, 10);
  sel5.option('1');
  sel5.option('2');
  sel5.option('3');
  sel5.option('4');
  sel5.option('5');
  sel5.selected('1');
  sel5.changed(mySelectEvent);
 
  // A triangle oscillator
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);
}

function mySelectEvent() {
  items[0] = sel1.value();
  items[1] = sel2.value();
  items[2] = sel3.value();
  items[3] = sel4.value();
  items[4] = sel5.value();
}

// A function to play a note
function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}

function draw() {

  // If we are autoplaying and it's time for the next note
  if (autoplay && millis() > trigger){
    playNote(notes[song[index].note], song[index].duration);
    trigger = millis() + song[index].duration;
    // Move to the next note
    index ++;
  // We're at the end, stop autoplaying.
  } else if (index >= song.length) {
    autoplay = false;
  }


  // Draw a keyboard

  // The width for each key
  let w = width/1.5 / notes.length;
  for (let i = 0; i < notes.length; i++) {
    let x = i * w;
    // If the mouse is over the key
    if (mouseX > x && mouseX < x + w && mouseY < height) {
      // If we're clicking
      if (mouseIsPressed) {
        fill(100,255,200);
      // Or just rolling over
      } else {
        fill(127);
      }
    } else {
      fill(200);
    }

    // Or if we're playing the song, let's highlight it too
    if (autoplay && i === song[index-1].note) {
      fill(100,255,200);
    }

    // Draw the key
    rect(x, 0, w-1, 80);
    // draw the dropdowns
    sel1.position(0, 90);
    sel2.position(1*w, 90);
    sel3.position(2*w, 90);
    sel4.position(3*w, 90);
    sel5.position(i*w, 90);
  }

}

function mouseDragged() 
{
  value = value + 5;
  if (value > 255) {
    value = 0;
  }
}

// When we click
function mousePressed(event) {
  if(event.button == 0 && event.clientX < width && event.clientY < height) {
    // Map mouse to the key index
    let key = floor(map(mouseX, 0, width/2, 0, notes.length));
    print(key);
   // playNote(notes[key].play());
    sounds[key].play();
    
  }
}

  
// Fade it out when we release
function mouseReleased() {
  osc.fade(0,0.5);
}


