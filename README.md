# BoomBoomLabs
A SYDE 361 project for music creation. Play here https://desolate-stream-78870.herokuapp.com/. 

## Essential Files
- The main app is housed in `./WebApp`.
- The main html page which the server points to can be found at `./WebApp/stepSequencer.html`.
- The relevant UI logic can be found in `./WebApp/public/js/index.js`.
- The UI components created can be found in `./WebApp/public/js/components/`.
- The genetic algorithm file can be found in `./WebApp/public/js/generate.js`.

## Setup Guide
1. Download Node:
- Go to https://nodejs.org/en/
- Select the button to download the LTS build that is "Recommended for most users".
2. Install Node by double-clicking on the downloaded file and following the installation prompts.
3. Go into `boomboomblabs/WebApp` directory with your terminal. Eg. `cd .../boomblabs/WebApp`
4. Run `npm install`
5. Run `npm start`
6. Goto `http://localhost:8000/` for step sequencer page.
7. Goto `http://localhost:8000/ga` for GA page.

## How to update this
### For Darren and Princely
Copy your `sketch.js` file to the `<script>` section in `boomboomlabs/WebApp/ga.html`.
