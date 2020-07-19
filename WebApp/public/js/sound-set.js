import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module"
import { newGeneration } from './generate.js';

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
        this.currentData = '';
        this.currentRow = 0;
        this.currentGeneration = 1;
        this.soundName = '';
    }

    _playSound(data) {
        if (Tone.Transport.seconds > 0 && this.currentData === data) {
            Tone.Transport.stop();
            this.currentData = '';
            return;
        }

        this.currentData = data;

        Tone.Transport.cancel();

        const soundName = this.soundName;
        const row = data.split('').map(val => Boolean(Number(val)));

        let loop = new Tone.Sequence(function(time, col) {        
            if (row[col]) {
                keys.get(soundName).start(time, 0, '32n');
            }
    
            Tone.Draw.schedule(function(){
                document.querySelector("step-sequencer").setAttribute("highlight", col);
            }, time);
        }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n').start(0);
        
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
    }

    static get styles() {
        return css`
            .sound-block {
                display: inline-block;
                border: 1px solid black;
                width: 100px;
                padding: 10px;
            }

            .generate {
                margin-top: 20px;
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
                        <button @click=${() => this._playSound(this.data[j][i].data)}>
                            ${this.currentData === this.data[j][i].data ? 'Pause' : 'Start'}
                        </button>
                        <select @change=${(e) => this._handleRatingChange(e, i, j)}>
                            <option value="1" selected="selected">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button @click=${() => this.callback(this.data[j][i].data, this.currentRow)}>Select</button>
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