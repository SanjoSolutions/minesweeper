import { Grid2D } from './Grid2D.js'
import {
  countFlaggedAsMineNeighbours,
  countNeighbouringMines, countUnflaggedAndUnrevealedNeighbours,
  countUnrevealedNeighbours, getNeighbours, getUnflaggedAndUnrevealedNeighbours,
  getUnrevealedNeighbours, isUnflaggedAndUnrevealed,
} from './minesweeper.js'

function isNumber(field, { row, column }) {
  const value = field.get({ row, column })
  return value >= 1 && value <= 9
}

function isEmpty(field, { row, column }) {
  const value = field.get({ row, column })
  return value === 0
}

function isEmptyOrNumber(field, { row, column }) {
  return (
    isEmpty(field, { row, column }) ||
    isNumber(field, { row, column })
  )
}

/**
 * @abstract
 */
class Pattern {
  matches(minesweeper, discountedField, { row, column }) {

  }

  async solve(minesweeper, { row, column }, render) {

  }
}

class PatternA extends Pattern {
  static isUnrevealed(minesweeper, discountedField, { row, column }) {
    return !minesweeper.isRevealed({ row, column })
  }

  static isDeterminedAsNumber(minesweeper, discountedField, { row, column }) {
    return PatternA.isUnrevealed(minesweeper, discountedField, { row, column })
  }

  static isDeterminedAsMine(minesweeper, discountedField, { row, column }) {
    return PatternA.isUnrevealed(minesweeper, discountedField, { row, column })
  }

  static isEdgeOrEmptyOrNumber(minesweeper, discountedField, { row, column }) {
    return (
      PatternA.isEdge(minesweeper, discountedField, { row, column }) ||
      PatternA.isEmpty(minesweeper, discountedField, { row, column }) ||
      PatternA.isNumber(minesweeper, discountedField, { row, column })
    )
  }

  static isEdge(minesweeper, discountedField, { row, column }) {
    return (
      row < 0 || row >= minesweeper.field.height ||
      column < 0 || column >= minesweeper.field.width
    )
  }

  static isEmpty(minesweeper, discountedField, { row, column }) {
    return isEmpty(discountedField, { row, column })
  }

  static isNumber(minesweeper, discountedField, { row, column }) {
    return isNumber(discountedField, { row, column })
  }

  static createIsSpecificNumber(number) {
    return function isSpecificNumber(minesweeper, { row, column }) {
      return minesweeper.field.get({ row, column }) === number
    }
  }

  constructor(patternSpecification) {
    super()
    this.specification = patternSpecification
  }

  matches(minesweeper, discountedField, { row, column }) {
    for (
      const { row: patternRow, column: patternColumn }
      of this.specification.positions()
      ) {
      const fieldPosition = {
        row: row + patternRow,
        column: column + patternColumn,
      }
      const matcher = this.specification.get({ row: patternRow, column: patternColumn })
      if (!matcher(minesweeper, discountedField, fieldPosition)) {
        return false
      }
    }

    return true
  }

  async solve(minesweeper, { row, column }, render) {
    for (
      const { row: patternRow, column: patternColumn }
      of this.specification.positions()
      ) {
      const patternValue = this.specification
        .get({ row: patternRow, column: patternColumn })
      if (patternValue === isDeterminedAsNumber) {
        minesweeper.reveal({
          row: row + patternRow,
          column: column + patternColumn,
        })
        render()
        await waitAfterSolve()
      } else if (patternValue === isDeterminedAsMine) {
        minesweeper.flagAsMine({
          row: row + patternRow,
          column: column + patternColumn,
        })
        render()
        await waitAfterSolve()
      }
    }
  }

  rotate90() {
    const rotatedSpecification = new Grid2D({
      height: this.specification.width,
      width: this.specification.height,
    })
    for (const { row, column } of this.specification.positions()) {
      rotatedSpecification.set(
        { row: column, column: row },
        this.specification.get({ row, column }),
      )
    }
    return new PatternA(rotatedSpecification)
  }
}

export class AllRemainingUnrevealedNeighboursAreNumbersPattern extends Pattern {
  matches(minesweeper, discountedField, { row, column }) {
    const discountedValue = discountedField.get({ row, column })
    const unrevealedNeighboursCount = countUnrevealedNeighbours(
      minesweeper,
      { row, column },
    )
    const flaggedAsMineNeighboursCount = countFlaggedAsMineNeighbours(
      discountedField,
      { row, column },
    )
    const unflaggedUnrevealedNeighboursCount = unrevealedNeighboursCount
      - flaggedAsMineNeighboursCount
    return discountedValue === 0 && unflaggedUnrevealedNeighboursCount >= 1
  }

  async solve(minesweeper, { row, column }, render) {
    for (
      const position
      of getUnflaggedAndUnrevealedNeighbours(minesweeper, { row, column })
      ) {
      minesweeper.reveal(position)
      render()
      await waitAfterSolve()
    }
  }
}

class AllRemainingUnrevealedNeighboursAreMinesPattern extends Pattern {
  matches(minesweeper, discountedField, { row, column }) {
    const discountedValue = discountedField.get({ row, column })
    const unrevealedNeighboursCount = countUnrevealedNeighbours(
      minesweeper,
      { row, column },
    )
    const flaggedAsMineNeighboursCount = countFlaggedAsMineNeighbours(
      discountedField,
      { row, column },
    )
    const unflaggedUnrevealedNeighboursCount = unrevealedNeighboursCount
      - flaggedAsMineNeighboursCount
    return discountedValue === unflaggedUnrevealedNeighboursCount &&
      unflaggedUnrevealedNeighboursCount >= 1
  }

  async solve(minesweeper, { row, column }, render) {
    for (
      const position
      of getUnrevealedNeighbours(minesweeper, { row, column })
      ) {
      minesweeper.flagAsMine(position)
      render()
      await waitAfterSolve()
    }
  }
}

const Q = PatternA.isUnrevealed
const N = PatternA.isDeterminedAsNumber
const M = PatternA.isDeterminedAsMine
const O = PatternA.isEdgeOrEmptyOrNumber

const patterns = concat([
  [
    new AllRemainingUnrevealedNeighboursAreNumbersPattern(),
    new AllRemainingUnrevealedNeighboursAreMinesPattern(),
  ],
  createPatternRotationVariations(
    new PatternA(
      new Grid2D({ height: 3, width: 4 }, [
        O, O, O, O,
        O, PatternA.createIsSpecificNumber(1), PatternA.createIsSpecificNumber(1), O,
        O, Q, Q, N,
      ]),
    ),
  ),
  createPatternRotationVariations(
    new PatternA(
      new Grid2D({ height: 3, width: 4 }, [
        O, O, O, O,
        O, PatternA.createIsSpecificNumber(1), PatternA.createIsSpecificNumber(2), O,
        O, Q, Q, M,
      ]),
    ),
  ),
])

function createPatternRotationVariations(pattern) {
  const pattern90 = pattern.rotate90()
  const pattern180 = pattern90.rotate90()
  const pattern270 = pattern180.rotate90()
  return [
    pattern,
    pattern90,
    pattern180,
    pattern270,
  ]
}

function concat(arrays) {
  return [].concat(...arrays)
}

export async function solve(minesweeper, render) {
  let hasChangedSomething
  do {
    hasChangedSomething = false
    const discountedField = createDiscountedField(minesweeper.field)
    for (let row = 0; row < minesweeper.field.height; row++) {
      for (let column = 0; column < minesweeper.field.width; column++) {
        for (const pattern of patterns) {
          if (pattern.matches(minesweeper, discountedField, { row, column })) {
            await pattern.solve(minesweeper, { row, column }, render)
            hasChangedSomething = true
          }
        }
      }
    }
    if (!hasChangedSomething) {
      hasChangedSomething =
        await revealUnflaggedAndUnrevealedFieldWithLowestProbabilityOfBeingAMine(
          minesweeper,
          render,
        )
    }
    if (!hasChangedSomething) {
      hasChangedSomething =
        await revealFirstUnflaggedAndUnrevealedField(minesweeper, render)
    }
  } while (hasChangedSomething && !minesweeper.isGameOver())
}

export function createDiscountedField(field) {
  const discountedField = field.clone()
  for (const { row, column } of field.positions()) {
    if (isNumber(field, { row, column })) {
      const discountedValue = calculateDiscountedValue(field, { row, column })
      discountedField.set({ row, column }, discountedValue)
    }
  }
  return discountedField
}

function calculateDiscountedValue(field, { row, column }) {
  const value = field.get({ row, column })
  const neighbouringMineCount = countFlaggedAsMineNeighbours(
    field,
    { row, column },
  )
  const discountedValue = value - neighbouringMineCount
  return discountedValue
}

async function revealUnflaggedAndUnrevealedFieldWithLowestProbabilityOfBeingAMine(
  minesweeper,
  render,
) {
  const fieldProbabilities = calculateMineProbabilities(minesweeper)
  const position = getCellWithLowestProbabilityOfBeingAMine(fieldProbabilities)
  if (position) {
    minesweeper.reveal(position)
    render()
    await waitAfterSolve()
    return true
  } else {
    return false
  }
}

function calculateMineProbabilities(minesweeper) {
  const fieldProbabilities = new Grid2D({
    height: minesweeper.field.height,
    width: minesweeper.field.width,
  })
  for (const { row, column } of fieldProbabilities.positions()) {
    if (isEmptyOrNumber(minesweeper.field, { row, column })) {
      const numberOfUnflaggedAndUnrevealedNeighbours = countUnflaggedAndUnrevealedNeighbours(
        minesweeper,
        { row, column },
      )
      if (numberOfUnflaggedAndUnrevealedNeighbours >= 1) {
        const value = minesweeper.field.get({ row, column })
        const numberOfUnflaggedMinesRemaining =
          value -
          countFlaggedAsMineNeighbours(minesweeper.field, { row, column })
        const probability = numberOfUnflaggedMinesRemaining
          / numberOfUnflaggedAndUnrevealedNeighbours

        const neighbours = getUnflaggedAndUnrevealedNeighbours(minesweeper, { row, column })
        for (const {row, column} of neighbours) {
          const currentProbability = fieldProbabilities.get({ row, column })
          if (
            typeof currentProbability === 'undefined' ||
            probability > currentProbability
          ) {
            fieldProbabilities.set(
              { row, column },
              probability,
            )
          }
        }
      }
    }
  }
  return fieldProbabilities
}

function getCellWithLowestProbabilityOfBeingAMine(fieldProbabilities) {
  let position = null
  let probability = null
  for (const { row, column } of fieldProbabilities.positions()) {
    const probabilityB = fieldProbabilities.get({ row, column })
    if (
      typeof probabilityB === 'number' &&
      (probability === null || probabilityB < probability)
    ) {
      position = { row, column }
      probability = probabilityB
    }
  }
  return position
}

async function revealFirstUnflaggedAndUnrevealedField(minesweeper, render) {
  const position = getFirstUnflaggedAndUnrevealedField(minesweeper)
  if (position) {
    minesweeper.reveal(position)
    render()
    await waitAfterSolve()
    return true
  } else {
    return false
  }
}

function getFirstUnflaggedAndUnrevealedField(minesweeper) {
  for (const { row, column } of minesweeper.field.positions()) {
    if (isUnflaggedAndUnrevealed(minesweeper, { row, column })) {
      return { row, column }
    }
  }
  return null
}

// async function waitAfterSolve() {
//   await sleep(500)
// }

function waitAfterSolve() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
