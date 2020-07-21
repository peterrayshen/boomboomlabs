import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module"
import './step-sequencer.js';
import { newGeneration } from '../generate.js';

export class SoundSet extends LitElement {
    static get properties() {
        return {
            currentData: { type: String },
            currentRow: { type: Number },
            currentGeneration: { type: Number },
            soundName: { type: String },
            data: { type: Array },
            ratings: { type: Array },
            callback: { type: Function }
        }
    }

    constructor() {
        super();
        this.data = [];
        this.currentData = '';
        this.currentRow = 0;
        this.currentGeneration = 1;
        this.soundName = '';
    }
    
    parseData(data) {
        return JSON.stringify(data.split('').map(val => [Boolean(Number(val))]));
    }

    resetSliders() {
        const slider = this.shadowRoot.querySelectorAll('.slider');
        // Reset slider position.
        for (let i = 0; i < slider.length; i++) {            
            slider[i].value = 1;
        }
    }

    _play(data, i) {
        const samples = {
            "hh" : "./sounds/hh.[mp3|ogg]",
            "hho" : "./sounds/hho.[mp3|ogg]",
            "kick" : "./sounds/kick.[mp3|ogg]",
            "snare" : "./sounds/snare.[mp3|ogg]"
        };
        const keys = new Tone.Players(samples, {"volume" : -10}).toMaster();
        
        if (Tone.Transport.seconds > 0 && this.currentData === data) {
            Tone.Transport.stop();
            this.currentData = '';
            return;
        }
        this.currentData = data;

        Tone.Transport.stop();
        Tone.Transport.cancel();

        const soundName = this.soundName;
        const row = data.split('').map(val => Boolean(Number(val)));
        const sequencer = this.shadowRoot.querySelector(`.sequencer-${i}`);

        let loop = new Tone.Sequence(function(time, col) {
            if (row[col]) keys.get(soundName).start(time, 0, '32n');
            Tone.Draw.schedule(() => sequencer.setAttribute("highlight", col), time);
        }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start(0);
        
        Tone.Transport.on("stop", () => {
            setTimeout(() => sequencer.setAttribute("highlight", "-1"), 100);
        });

        Tone.Transport.start();
    }

    _generate() {
        let result = newGeneration(this.data);
        this.data = result;
        this.currentGeneration++;
        this.resetSliders();
        this.requestUpdate();
    }

    _handleRatingChange(e, i) {
        this.data[i].rating = Number(e.path[0].value);
        this.requestUpdate();
    }

    static get styles() {
        return css`
            .sound-block {
                padding: 10px;
            }
            .generate {
                margin-top: 20px;
            }
            input[type="range"] {
                width: 50%;
            }
        `;
    }

    render() {
        return html`
            <h1>Modifying Row ${this.currentRow}</h1>                      
                <div class="generate">
                    <button @click=${this._generate}>Generate</button>
                    <span>generation ${this.currentGeneration}</span>
                </div>
                ${this.data.map((val, i) => html`
                    <div class="sound-block">
                        <span>Sound ${i + 1}</span>
                        <button @click=${() => this._play(val.data, i)}>
                            ${this.currentData === val.data ? 'Pause' : 'Start'}
                        </button>
                        <input class="slider" type="range" min="1" max="5" value=${val.rating} step="1" @input=${(e) => this._handleRatingChange(e, i)}>
                        <span>${val.rating}</span>
                        <button @click=${() => this.callback(val.data, this.currentRow)}>Select</button>
                        <step-sequencer
                            values=${this.parseData(val.data)}
                            class="sequencer-${i}" 
                            rows="1"
                        ></step-sequencer>
                    </div>
                `)}
        `;
    }
}

customElements.define('sound-set', SoundSet)