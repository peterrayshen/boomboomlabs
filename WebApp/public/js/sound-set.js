import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module"

export class SoundSet extends LitElement {
    static get properties() {
        return {
            data: { type: Array },
            callback: { type: Function }
        }
    }

    constructor() {
        super();
    }

    _playSound(data) {
        

        Tone.Transport.cancel();

        const soundName = 'hh';
        const row = data.split('').map(val => Boolean(Number(val)));
        console.log(row);

        loop2 = new Tone.Sequence(function(time, col) {        
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
            ${this.data.map((val, i) => html`
                <div class="sound-block">
                    <span>Sound ${i + 1}</span>
                    <button @click=${() => this._playSound(this.data[i])}>Play</button>
                    <select>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    <button @click=${() => this.callback('eggs')}>Select</button>
                </div>
            `)}
        `;
    }
}

customElements.define('sound-set', SoundSet)