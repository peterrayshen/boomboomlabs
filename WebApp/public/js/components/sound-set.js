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
            callback: { type: Function },
            style: { type: String },
            hideSliders: { type: Boolean }
        }
    }

    constructor() {
        super();
        this.data = [];
        this.currentData = '';
        this.currentRow = 0;
        this.currentGeneration = 1;
        this.soundName = '';
        this.style = 'none';    
        this.hideSliders = false;
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

    resetRadio() {
        if (this.hideSliders) {
            const radio = this.shadowRoot.querySelector('#none');
            this.style = 'none';
            radio.checked = true;
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
        let result = this.style !== 'none' ? newGeneration(this.data, this.style, this.soundName) : newGeneration(this.data);
        this.data = result;
        this.currentGeneration++;
        this.resetSliders();
        this.requestUpdate();
    }

    _handleRatingChange(e, i) {
        this.data[i].rating = Number(e.path[0].value);
        this.requestUpdate();
    }

    _handleStyle(e) {
        this.style = e.path[0].value;
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
            button {
                cursor: pointer;
                box-shadow: 1px 1px 3px #747474;
                font-family: 'Roboto Mono', monospace;
                color: Black;
                padding: 5px;
                border-radius: 4px;
                border: none;
            }
            button:hover {
                background-color: #b2b2b2;
                transition: 0.3s;
            }
            .slider {
                width: 300px !important;
                position: relative !important;
                top: 3px !important;
            }
            .sound-block > .controls {
                margin-bottom: 4px;
            }

            .generate > button {
                background-color: teal;
                color: white;
                padding: 10px;
            }

            .generate > button:hover {
                background-color: #006868;
                color: white;
                transition: 0.3s;
                
            }

            .generate {
                display: inline-block;
                text-align: center;
                width: 100%;
                margin-bottom: 10px;
            }

            .select-button {
                float: right;
            }
        `;
    }

    render() {
        return html`
            <h1>Modifying Row ${this.currentRow}</h1>                      
                <div class="generate">
                    <button @click=${this._generate}>Generate</button>
                    <span>generation ${this.currentGeneration}</span>
                    ${this.hideSliders ? html`
                    <div>
                        <input type="radio" id="none" name="style" value="none" @click=${this._handleStyle} checked>
                        <label for="male">None</label>
                        <input type="radio" id="hiphop" name="style" value="hiphop" @click=${this._handleStyle}>
                        <label for="female">Hiphop</label>
                        <input type="radio" id="edm" name="style" value="edm" @click=${this._handleStyle}>
                        <label for="other">EDM</label>
                        <input type="radio" id="rock" name="style" value="rock" @click=${this._handleStyle}>
                        <label for="other">Rock</label>
                    </div>` : html``}
                </div>
                ${this.data.map((val, i) => html`
                    <div class="sound-block">
                        <div class="controls">
                            <span>Sound ${i + 1}</span>
                            <button @click=${() => this._play(val.data, i)}>
                                ${this.currentData === val.data ? 'Pause' : 'Start'}
                            </button>
                            ${!this.hideSliders ? html`
                                <input class="slider" type="range" min="1" max="5" value=${val.rating} step="1" @input=${(e) => this._handleRatingChange(e, i)}>
                                <span>${val.rating}</span>
                            ` : html``}
                            <button class="select-button" @click=${() => this.callback(val.data, this.currentRow)}>Select</button>
                        </div>
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