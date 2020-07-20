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
        return data.split('').map(val => [Boolean(Number(val))])
    }

    _play(data, i, generation) {
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
        const sequencer = this.shadowRoot.querySelector(`.sequencer-${generation}-${i}`);

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
        let result = newGeneration(this.data[0]);
        this.data.push(result);
        console.log(this.data);
        this.currentGeneration++;
    }

    _handleRatingChange(e, i, generation) {
        this.data[generation][i].rating = Number(e.path[0].value);
        this.requestUpdate();
    }

    static get styles() {
        return css`
            .sound-block {
                border: 1px solid black;
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
            ${this.data.map((generation, j) => html`
                <h3>generation ${j+1}</h3>
                ${generation.map((val, i) => html`
                    <div class="sound-block">
                        <span>Sound ${i + 1}</span>
                        <button @click=${() => this._play(this.data[j][i].data, i, j)}>
                            ${this.currentData === this.data[j][i].data ? 'Pause' : 'Start'}
                        </button>
                        <input type="range" min="1" max="5" value="1" step="1" @input=${(e) => this._handleRatingChange(e, i, j)}>
                        <span>${this.data[j][i].rating}</span>
                        <button @click=${() => this.callback(this.data[j][i].data, this.currentRow)}>Select</button>
                        <step-sequencer
                            values=${JSON.stringify(this.parseData(this.data[j][i].data))}
                            class="sequencer-${j}-${i}" 
                            rows="1"
                        ></step-sequencer>
                    </div>
                `)}
            `)}
            <div class="generate">
                <button @click=${this._generate}>Generate</button>
            </div>
        `;
    }
}

customElements.define('sound-set', SoundSet)