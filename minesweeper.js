import { Grid2D } from './Grid2D.js'

export const MINE = -1
export const FLAGGED_AS_MINE = -2

export class Minesweeper {
  constructor({ height, width, mines }) {
    this._field = createField({ height, width, mines })
    this.field = createRevealedField({ height, width })
    this._isGameOver = false
  }

  isRevealed({ row, column }) {
    const value = this.field.get({ row, column })
    return (
      (value >= 0 && value <= 9) ||
      value === MINE
    )
  }

  isGameOver() {
    return this._isGameOver
  }

  reveal({ row, column }) {
    const value = this._field.get({ row, column })
    this.field.set({ row, column }, value)
    if (value === 0) {
      let positions = [
        { row: row - 1, column: column - 1 },
        { row: row - 1, column },
        { row: row - 1, column: column + 1 },
        { row, column: column - 1 },
        { row, column: column + 1 },
        { row: row + 1, column: column - 1 },
        { row: row + 1, column },
        { row: row + 1, column: column + 1 },
      ]
      positions = positions
        .filter(isPositionOnField.bind(null, this))
        .filter(isUnrevealed.bind(null, this))
      for (const position of positions) {
        this.reveal(position)
      }
    } else if (value === MINE) {
      this._isGameOver = true
    }
  }

  flagAsMine({ row, column }) {
    this.field.set({ row, column }, FLAGGED_AS_MINE)
  }

  unflagAsMine({row, column}) {
    this.field.set({ row, column }, undefined)
  }

  toggleFlagAsMine({row, column}) {
    if (isFlaggedAsMine(this.field, {row, column})) {
      this.unflagAsMine({row, column})
    } else if (isUnrevealed(this, {row, column})) {
      this.flagAsMine({row, column})
    }
  }
}

function isPositionOnField(minesweeper, { row, column }) {
  return (
    row >= 0 && row < minesweeper.field.height &&
    column >= 0 && column < minesweeper.field.width
  )
}

function isUnrevealed(minesweeper, { row, column }) {
  return !minesweeper.isRevealed({ row, column })
}

function createField({ height, width, mines }) {
  const field = new Grid2D({ height, width })
  const positions = Array.from(field.positions())
  for (let i = 0; i < mines; i++) {
    const { row, column } = popRandomValue(positions)
    field.set({ row, column }, MINE)
  }
  for (const { row, column } of field.positions()) {
    if (field.get({ row, column }) !== MINE) {
      populateNumber(field, { row, column })
    }
  }
  return field
}

function populateNumber(field, { row, column }) {
  field.set({ row, column }, determineNumber(field, { row, column }))
}

function determineNumber(field, { row, column }) {
  return countNeighbouringMines(field, { row, column })
}

export function getNeighbours(field, { row: cellRow, column: cellColumn }) {
  let positions = []
  for (
    let row = Math.max(0, cellRow - 1);
    row <= Math.min(cellRow + 1, field.height - 1);
    row++
  ) {
    for (
      let column = Math.max(0, cellColumn - 1);
      column <= Math.min(cellColumn + 1, field.width - 1);
      column++
    ) {
      if (!(row === cellRow && column === cellColumn)) {
        positions.push({ row, column })
      }
    }
  }
  return positions
}

function isMine(field, { row, column }) {
  return field.get({ row, column }) === MINE
}

export function countNeighbouringMines(field, { row, column }) {
  return getNeighbours(field, { row, column })
    .filter(isMine.bind(null, field))
    .length
}

export function getUnrevealedNeighbours(minesweeper, { row, column }) {
  return getNeighbours(minesweeper.field, { row, column })
    .filter(isUnrevealed.bind(null, minesweeper))
}

export function countUnrevealedNeighbours(minesweeper, { row, column }) {
  return getUnrevealedNeighbours(minesweeper, { row, column }).length
}

function isFlaggedAsMine(field, { row, column }) {
  return field.get({ row, column }) === FLAGGED_AS_MINE
}

export function getFlaggedAsMineNeighbours(field, { row, column }) {
  return getNeighbours(field, { row, column })
    .filter(isFlaggedAsMine.bind(null, field))
}

export function countFlaggedAsMineNeighbours(field, { row, column }) {
  return getFlaggedAsMineNeighbours(field, { row, column }).length
}

export function getUnflaggedAndUnrevealedNeighbours(minesweeper, { row, column }) {
  return getNeighbours(minesweeper.field, { row, column })
    .filter(isUnflaggedAndUnrevealed.bind(null, minesweeper))
}

export function countUnflaggedAndUnrevealedNeighbours(minesweeper, {row, column}) {
  return getUnflaggedAndUnrevealedNeighbours(minesweeper, { row, column }).length
}

export function isUnflaggedAndUnrevealed(minesweeper, { row, column }) {
  return (
    isUnflagged(minesweeper, { row, column }) &&
    isUnrevealed(minesweeper, { row, column })
  )
}

export function isUnflagged(minesweeper, { row, column }) {
  return !isFlaggedAsMine(minesweeper.field, { row, column })
}

export function printField(field) {
  console.log(fieldToString(field))
}

export function fieldToString(field) {
  let output = ''
  for (let row = 0; row < field.height; row++) {
    for (let column = 0; column < field.width; column++) {
      const value = field.get({ row, column })
      let char
      if (value === MINE) {
        char = '*'
      } else if (value === FLAGGED_AS_MINE) {
        char = 'F'
      } else if (typeof value === 'number') {
        char = String(value)
      } else {
        char = ' '
      }
      output += char + ' '
    }
    output = output.substr(0, output.length - 1) + '\n'
  }
  return output
}

function createRevealedField({ height, width }) {
  const revealedField = new Grid2D({ height, width })
  return revealedField
}

function popRandomValue(values) {
  return values.splice(randomIndex(values), 1)[0]
}

function randomIndex(values) {
  return Math.floor(Math.random() * values.length)
}
