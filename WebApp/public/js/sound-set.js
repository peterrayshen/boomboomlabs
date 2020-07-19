import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module"

export class SoundSet extends LitElement {
    static get properties() {
        return {
            currentData: { type: String },
            currentRow: { type: Number },
            soundName: { type: String },
            data: { type: Array },
            callback: { type: Function }
        }
    }

    constructor() {
        super();
        this.currentData = '';
        this.currentRow = 0;
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

    static get styles() {
        return css`
            .sound-block {
                display: inline-block;
                border: 1px solid black;
                width: 100px;
                padding: 10px;
            }
        `;
    }

    render() {
        return html`
            <h1>Modifying Row ${this.currentRow}</h1>
            ${this.data.map((val, i) => html`
                <div class="sound-block">
                    <span>Sound ${i + 1}</span>
                    <button @click=${() => this._playSound(this.data[i])}>
                        ${this.currentData === this.data[i] ? 'Pause' : 'Start'}
                    </button>
                    <select>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    <button @click=${() => this.callback(this.data[i], this.currentRow)}>Select</button>
                </div>
            `)}
        `;
    }
}

customElements.define('sound-set', SoundSet)