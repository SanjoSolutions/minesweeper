import { Grid } from './Grid.js'

export class Grid2D {
  constructor({height, width}, values = null) {
    this.height = height
    this.width = width
    this._grid = new Grid([width, height], values)
  }

  get({row, column}) {
    return this._grid.get([column, row])
  }

  set({row, column}, value) {
    this._grid.set([column, row], value)
  }

  calculatePosition(index) {
    const [column, row] = this._grid.calculatePosition(index)
    return {row, column}
  }

  * positions() {
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        yield {row, column}
      }
    }
  }

  clone() {
    const clone = new Grid2D(
      {
        height: this.height,
        width: this.width
      },
      Array.from(this._grid.getValues())
    )
    return clone
  }
}
