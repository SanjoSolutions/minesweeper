import { createTemplate } from './createTemplate.js'
import { MinesweeperCell } from './MinesweeperCell.js'

const template = createTemplate(`
  <template>
    <style>
      :host {
        display: block;
      }
    
      .field {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }
    </style>
    <div class="field"></div>
  </template>
`)

export class MinesweeperField extends HTMLElement {
  static get observedAttributes() {
    return [
      'height',
      'width',
    ]
  }

  constructor() {
    super()
    this._minesweeper = null
    const templateContent = template.content
    this._shadowRoot = this.attachShadow({ mode: 'closed' })
    this._shadowRoot.appendChild(templateContent.cloneNode(true))
  }

  set minesweeper(value) {
    this._minesweeper = value
    this._update()
  }

  _update() {
    const $field = this._getField()
    const field = this._minesweeper.field
    $field.style.height = `${field.height * 16}px`
    $field.style.width = `${field.width * 16}px`
    $field.innerHTML = ''
    for (const {row, column} of field.positions()) {
      const $cell = new MinesweeperCell()
      $cell.setAttribute('value', field.get({row, column}))
      $cell.setAttribute(
        'revealed',
        String(this._minesweeper.isRevealed({row, column}))
      )
      $field.appendChild($cell)
    }
  }

  _getField() {
    return this._shadowRoot.querySelector('.field')
  }

  attributeChangedCallback(name, oldValue, newValue) {

  }
}

customElements.define('minesweeper-field', MinesweeperField)
