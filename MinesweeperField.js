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
  constructor() {
    super()
    this._minesweeper = null
    const templateContent = template.content
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(templateContent.cloneNode(true))
  }

  set minesweeper(value) {
    const justUpdate = Boolean(this._minesweeper)
    this._minesweeper = value
    this._update(justUpdate)
  }

  getCells() {
    return Array.from(this._shadowRoot.querySelectorAll('minesweeper-cell'))
  }

  _update(justUpdate) {
    if (justUpdate) {
      this._justUpdate()
    } else {
      this._renderInitially()
    }
  }

  _justUpdate() {
    const $field = this._getField()
    const $cells = Array.from($field.children)
    const field = this._minesweeper.field
    let index = 0
    for (const {row, column} of field.positions()) {
      const $cell = $cells[index]
      this._updateCell($cell, {row, column})
      index++
    }
  }

  _renderInitially() {
    const $field = this._getField()
    const field = this._minesweeper.field
    $field.style.height = `${field.height * 16}px`
    $field.style.width = `${field.width * 16}px`
    for (const {row, column} of field.positions()) {
      const $cell = new MinesweeperCell()
      this._updateCell($cell, {row, column})
      $field.appendChild($cell)
    }
  }

  _updateCell($cell, {row, column}) {
    const field = this._minesweeper.field
    $cell.setAttribute('value', field.get({row, column}))
    $cell.setAttribute(
      'revealed',
      String(this._minesweeper.isRevealed({row, column}))
    )
  }

  _getField() {
    return this._shadowRoot.querySelector('.field')
  }
}

customElements.define('minesweeper-field', MinesweeperField)
