import { FLAGGED_AS_MINE, MINE, Minesweeper } from './minesweeper.js'
import {
  AllRemainingUnrevealedNeighboursAreNumbersPattern,
  createDiscountedField,
} from './minesweeper_solver.js'

function createMinesweeper() {
  const minesweeper = new Minesweeper({height: 2, width: 2, mines: 1})

  minesweeper._field.set({row: 0, column: 0}, 1)
  minesweeper._field.set({row: 0, column: 1}, MINE)
  minesweeper._field.set({row: 1, column: 0}, 1)
  minesweeper._field.set({row: 1, column: 1}, 1)

  return minesweeper
}

describe('AllRemainingUnrevealedNeighboursAreNumbersPattern', () => {
  describe('matches', () => {
    it('detects a pattern where all remaining unrevealed neighbours are numbers', () => {
      const minesweeper = createMinesweeper()
      minesweeper.reveal({row: 0, column: 0})
      minesweeper.flagAsMine({row: 0, column: 1})
      const pattern = new AllRemainingUnrevealedNeighboursAreNumbersPattern()
      const discountedField = createDiscountedField(minesweeper.field)
      const isMatching = pattern.matches(
        minesweeper,
        discountedField,
        {row: 0, column: 0}
      )
      expect(isMatching).toEqual(true)
    })

    it('returns false when all fields are revealed or flagged', () => {
      const minesweeper = new Minesweeper({height: 2, width: 2, mines: 1})

      minesweeper._field.set({row: 0, column: 0}, 1)
      minesweeper._field.set({row: 0, column: 1}, MINE)
      minesweeper._field.set({row: 1, column: 0}, 1)
      minesweeper._field.set({row: 1, column: 1}, 1)
      minesweeper.reveal({row: 0, column: 0})
      minesweeper.flagAsMine({row: 0, column: 1})
      minesweeper.reveal({row: 1, column: 0})
      minesweeper.reveal({row: 1, column: 1})
      const pattern = new AllRemainingUnrevealedNeighboursAreNumbersPattern()
      const discountedField = createDiscountedField(minesweeper.field)
      const isMatching = pattern.matches(
        minesweeper,
        discountedField,
        {row: 0, column: 0}
      )
      expect(isMatching).toEqual(false)
    })
  })

  describe('solve', () => {
    it('solves the pattern', async () => {
      const minesweeper = createMinesweeper()
      minesweeper.reveal({row: 0, column: 0})
      minesweeper.flagAsMine({row: 0, column: 1})
      const pattern = new AllRemainingUnrevealedNeighboursAreNumbersPattern()
      const render = () => {}
      // TODO: stub waitAfterSolve
      await pattern.solve(minesweeper, {row: 0, column: 0}, render)
      const field = minesweeper.field
      expect(field.get({row: 0, column: 0})).toEqual(1)
      expect(field.get({row: 0, column: 1})).toEqual(FLAGGED_AS_MINE)
      expect(field.get({row: 1, column: 0})).toEqual(1)
      expect(field.get({row: 1, column: 1})).toEqual(1)
    })
  })
})
