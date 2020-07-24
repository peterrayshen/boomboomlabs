import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module"

export class ToneStepSequencer extends LitElement {
    static get properties() {
        return {
            label: { type: String },
            rows: { type: Number },
            columns: { type: Number },
            highlight: { type: Number },
            values: { type: Array },
            callback: { type: Function },
            isEditable: { type: Boolean },
            test: { type: String }
        }
    }

    constructor() {
        super()
        this.rows = 4
        this.columns = 16
        this.highlight = -1
        this.values = []
        this.adding = false
        this.isEditable = false;
        this.test = '';
    }

    get currentColumn() {
        return this.values[Math.clamp(this.highlight, 0, this.columns - 1)]
    }

    updateValues(sequence, row) {
        sequence.split('').forEach((val, col) => {
            this.values[col][row-1] = Boolean(Number(val));
        });

        this.requestUpdate();
    }

    _mousedown(e, x, y) {
        if (!this.isEditable) return;
        if (e.cancelable) {
            e.preventDefault()
        }
        this.adding = !this.values[x][y]
        this.values[x][y] = this.adding
        this.requestUpdate()
    }

    _mousemove(e, x, y) {
        if (!this.isEditable) return;
        if (e.cancelable) {
            e.preventDefault()
        }
        if (e.buttons) {
            this.values[x][y] = this.adding
            this.requestUpdate()
        } else if (e.changedTouches) {
            const { clientWidth, clientHeight } = this.shadowRoot.querySelector('#container')
            const { top, left } = this.getBoundingClientRect()
            //just use the first touch
            Array.from(e.changedTouches).forEach(touch => {
                const offsetX = (touch.clientX - left) / clientWidth
                const offsetY = (touch.clientY - top) / clientHeight
                x = Math.floor(offsetX * this.columns)
                y = Math.floor(offsetY * this.rows)
                this.values[x][y] = this.adding
            })
            this.requestUpdate()
        }
    }

    firstUpdated(changed) {
        if (this.values.length > 0) return;
        if (changed.has('columns') || changed.has('rows')) {
            this.values = [];

            for (let x = 0; x < this.columns; x++) {
                const column = []
                for (let y = 0; y < this.rows; y++) {
                    column[y] = false
                }
                this.values.push(column);
            }
            this.requestUpdate();
        }
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                width: 100%;
                height: fit-content;
            }
            .container {
                width: 100%;
                height: 100%;
                display: flex;
            }
            .column {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .column.highlight {
                
            }
            .column.highlight .row {
                
                background-color: grey;
            }
            .column.highlight .row.filled {
                transition: background-color 0.1s;
            }
            .column.highlight .row.filled{
                background-color: white;
            }
            .row {
                flex: 1;
                margin: 1px 1px 6px 1px;
                background-color: #c0c0c0;
                transition: background-color 0s;
                border-radius: 4px;
            }
            .row.filled {
                background-color: #256868;
            }
            .row button {
                width: 100%;
                height: 100%;
            }

            .modify-button {
                background-color: transparent !important;
            }

            .isEdit {
                height: 275px;
            }

            .isEdit > .column {
                cursor: pointer;
            }

            .adj > .column {
                height: 30px;
            }

            button {
                margin-left: 5px;
                cursor: pointer;
                box-shadow: 1px 1px 3px #747474;
                font-family: 'Roboto Mono', monospace;
                color: black;
                
                border-radius: 4px;
                border: none;
            }
            button:hover {
                background-color: #e7e7e7;
                transition: 0.3s;
            }

            .isEdit .row.filled:hover {
                background-color: teal !important;
                transition: 0.15s;
            }

            .isEdit .row:hover {
                background-color: #9b9b9b;
                transition: 0.15s;
            }
        `;
    }

    render() {
        return html`
            <div class=${this.isEditable ? "container isEdit" : "container adj"}>
                ${this.values.map((column, x) => html`
                    <div class="column ${x === this.highlight ? 'highlight' : ''}">
						${column.map((row, y) => html`
							<div
								@mousemove=${e => this._mousemove(e, x, y)} 
								@touchmove=${e => this._mousemove(e, x, y)} 
								@mousedown=${e => this._mousedown(e, x, y)} 
								@touchstart=${e => this._mousedown(e, x, y)} 
								@touchend=${() => this.adding = false} 
								@mouseup=${() => this.adding = false} 
                                class="row ${row ? 'filled' : ''}"></div>
                        `)}
                    </div>`)}
                ${this.isEditable ? html`<div class="column">
                    ${Array(this.rows).fill(0).map((e, i) => html`
                        <div class="row modify-button">
                            <button @click=${() => this.callback(i + 1)}>Gen</button>
                        </div>                        
                    `)}
                </div>` : html``}
            </div>
        `
    }
}

customElements.define('step-sequencer', ToneStepSequencer)

