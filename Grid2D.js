export class Grid2D {
  constructor({height, width}, values = null) {
    this.height = height
    this.width = width
    this._values = values ?? new Array(height * width)
  }

  get({row, column}) {
    return this._values[this._calculateIndex({row, column})]
  }

  set({row, column}, value) {
    this._values[this._calculateIndex({row, column})] = value
  }

  calculatePosition(index) {
    return {
      row: Math.floor(index / this.width),
      column: index % this.width
    }
  }

  _calculateIndex({row, column}) {
    return row * this.width + column
  }

  * positions() {
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        yield {row, column}
      }
    }
  }

  clone() {
    const clone = new Grid2D({
      height: this.height,
      width: this.width
    }, [...this._values])
    return clone
  }
}
