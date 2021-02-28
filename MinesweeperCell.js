import { createTemplate } from './createTemplate.js'
import { FLAGGED_AS_MINE, MINE } from './minesweeper.js'

const template = createTemplate(`
  <template>
    <style>
      :host {
        display: block;
      }
    
      .cell {
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background-color: #c0c0c0;
        font-family: sans-serif;
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        user-select: none;
        position: relative;
      }
      
      .cell__value {
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 16px;
        text-align: center;
      }
      
      .cell--unrevealed {
        border-top: 2px solid white;
        border-right: 2px solid #808080;
        border-bottom: 2px solid #808080;
        border-left: 2px solid white;
      }
      
      .cell--unrevealed .cell__value {
        display: none;
      }
      
      .cell--focused,
      .cell--revealed {
        border-top: 1px solid #808080;
        border-right: none;
        border-bottom: none;
        border-left: 1px solid #808080;
      }
      
      .cell--focused .cell__value,
      .cell--revealed .cell__value {
        top: -1px;
        left: -1px;
      }
      
      .cell--flagged {
        background-image: url("images/flag.png");
        background-image: image-set(
          "images/flag.png", 1x,
          "images/flag@2x.png", 2x,
          "images/flag@3x.png", 3x,
          "images/flag@4x.png", 4x
        );
        background-size: 16px 16px;
        background-position: center center;
        background-repeat: no-repeat;
        image-rendering: pixelated;
      }
      
      .cell--mine {
      background-image: url("images/mine.png");
        background-image: image-set(
          "images/mine.png", 1x,
          "images/mine@2x.png", 2x,
          "images/mine@3x.png", 3x,
          "images/mine@4x.png", 4x
        );
        background-size: 16px 16px;
        background-position: center center;
        background-repeat: no-repeat;
        image-rendering: pixelated;
      }
    </style>
    <div class="cell">
      <div class="cell__value"></div>
    </div>
  </template>
`)

/**
 * @example
 * <script type="module" src="MinesweeperCell.js"></script>
 * <minesweeper-cell value="5" revealed="false"></minesweeper-cell>
 */
export class MinesweeperCell extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'revealed'
    ]
  }

  constructor() {
    super()
    const templateContent = template.content
    this._shadowRoot = this.attachShadow({mode: 'closed'})
    this._shadowRoot.appendChild(templateContent.cloneNode(true))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      const value = parseInt(newValue, 10)
      if (value === MINE) {
        this._getCellValue().textContent = ''
        this._getCell().classList.remove('cell--flagged')
        this._getCell().classList.add('cell--mine')
      } else if (value === FLAGGED_AS_MINE) {
        this._getCellValue().textContent = ''
        this._getCell().classList.remove('cell--mine')
        this._getCell().classList.add('cell--flagged')
      } else {
        this._getCellValue().textContent = newValue
        this._getCell().classList.remove('cell--mine')
        this._getCell().classList.remove('cell--flagged')
      }
    } else if (name === 'revealed') {
      const revealed = newValue !== 'false'
      if (revealed) {
        this._getCell().classList.remove('cell--unrevealed')
        this._getCell().classList.add('cell--revealed')
        this._getCell().classList.remove('cell--flagged')
      } else {
        this._getCell().classList.add('cell--unrevealed')
        this._getCell().classList.remove('cell--revealed')
        this._getCell().classList.remove('cell--mine')
      }

    }
  }

  connectedCallback() {
    if (this.isConnected) {
      const cell = this._getCell()
      cell.addEventListener('pointerdown', () => {
        this._focus()
      })
      cell.addEventListener('pointermove', (event) => {
        const isPrimaryMouseButtonDown = event.buttons === 1
        if (isPrimaryMouseButtonDown) {
          this._focus()
        }
      })
      cell.addEventListener('pointerup', () => {
        this._unfocus()
      })
      cell.addEventListener('pointerleave', () => {
        this._unfocus()
      })
    }
  }

  _focus() {
    this._getCell().classList.add('cell--focused')
  }

  _unfocus() {
    this._getCell().classList.remove('cell--focused')
  }

  _getCell() {
    return this._shadowRoot.querySelector('.cell')
  }

  _getCellValue() {
    return this._shadowRoot.querySelector('.cell__value')
  }
}

customElements.define('minesweeper-cell', MinesweeperCell)
