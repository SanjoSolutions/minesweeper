import { product } from './product.js'

export class Grid {
  constructor(dimensionSizes, values = null) {
    this.numberOfDimensions = dimensionSizes.length
    this.dimensionSizes = dimensionSizes
    this._values = values ?? new Array(this._calculateTotalSize(dimensionSizes))
  }

  _calculateTotalSize(dimensionSizes) {
    return product(...dimensionSizes)
  }

  get(position) {
    return this._values[this._calculateIndex(position)]
  }

  set(position, value) {
    this._values[this._calculateIndex(position)] = value
  }

  calculatePosition(index) {
    const position = new Array(this.numberOfDimensions)
    let multiplicator = 1
    for (
      let dimensionIndex = 0;
      dimensionIndex < this.numberOfDimensions - 1;
      dimensionIndex++
    ) {
      const dimensionSize = this.dimensionSizes[dimensionIndex]
      multiplicator *= dimensionSize
    }
    for (
      let dimensionIndex = this.numberOfDimensions - 1;
      dimensionIndex >= 0;
      dimensionIndex--
    ) {
      const value = Math.floor(index / multiplicator)
      index -= value * multiplicator
      position[dimensionIndex] = value
      const dimensionSize = this.dimensionSizes[dimensionIndex - 1]
      multiplicator /= dimensionSize
    }
    return position
  }

  _calculateIndex(position) {
    let index = 0
    let multiplicator = 1
    for (let dimensionIndex = 0; dimensionIndex < this.numberOfDimensions; dimensionIndex++) {
      const dimensionSize = this.dimensionSizes[dimensionIndex]
      index += position[dimensionIndex] * multiplicator
      multiplicator *= dimensionSize
    }
    return index
  }

  * positions() {
    const position = new Array(this.numberOfDimensions).fill(0)
    let nextIndexToIncrement
    do {
      yield Array.from(position)
      while (position[0] < this.dimensionSizes[0] - 1) {
        position[0]++
        yield Array.from(position)
      }
      nextIndexToIncrement = 1
      while (
        nextIndexToIncrement < this.numberOfDimensions &&
        position[nextIndexToIncrement] >= this.dimensionSizes[nextIndexToIncrement] - 1
        ) {
        nextIndexToIncrement++
      }
      if (nextIndexToIncrement < this.numberOfDimensions) {
        position[nextIndexToIncrement]++
        for (let index = 0; index < nextIndexToIncrement; index++) {
          position[index] = 0
        }
      }
    } while (nextIndexToIncrement < this.numberOfDimensions)
  }

  getValues() {
    return this._values
  }

  clone() {
    const clone = new Grid(this.dimensionSizes, [...this._values])
    return clone
  }
}
