import { FLAGGED_AS_MINE, Minesweeper } from './minesweeper.js'

describe('Minesweeper', () => {
  describe('flagAsMine', () => {
    it('flags the cell as mine', () => {
      const minesweeper = new Minesweeper({height: 1, width: 1, mines: 1})
      minesweeper.flagAsMine({row: 0, column: 0})
      expect(minesweeper.field.get({row: 0, column: 0})).toEqual(FLAGGED_AS_MINE)
    })
  })
})
