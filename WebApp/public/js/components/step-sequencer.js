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
            console.log('ran');
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

    updated(changed) {
        if (this.values.hasChanged) {
            // this.updateValues(this.test, 1);
            console.log(this.values);
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
                background-color: gray;
            }
            .column.highlight .row {
                transition-duration: 0.4s;
            }
            .column.highlight .row.filled {
                transition: background-color 0.1s;
            }
            .column.highlight .row.filled{
                background-color: white;
            }
            .row {
                flex: 1;
                margin: 1px 1px 4px 1px;
                background-color: gray;
                transition: background-color 0s;
            }
            .row.filled {
                background-color: teal;
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
                height: 50px;
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
                            <button @click=${() => this.callback(i + 1)}>Modify</button>
                        </div>                        
                    `)}
                </div>` : html``}
            </div>
        `
    }
}

customElements.define('step-sequencer', ToneStepSequencer)

