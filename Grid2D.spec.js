import { Grid2D } from './Grid2D.js'

describe('Grid2D', () => {
  describe('get and set', () => {
    it('gets and sets values', () => {
      const grid = new Grid2D({height: 2, width: 2})
      grid.set({row: 0, column: 0}, 0)
      grid.set({row: 0, column: 1}, 1)
      grid.set({row: 1, column: 0}, 2)
      grid.set({row: 1, column: 1}, 3)
      expect(grid.get({row: 0, column: 0})).toEqual(0)
      expect(grid.get({row: 0, column: 1})).toEqual(1)
      expect(grid.get({row: 1, column: 0})).toEqual(2)
      expect(grid.get({row: 1, column: 1})).toEqual(3)
    })
  })

  describe('calculatePosition', () => {
    it('calculates the position for an index', () => {
      const grid = new Grid2D({height: 1, width: 1})
      const index = 0
      const expectedPositon = {row: 0, column: 0}
      expect(grid.calculatePosition(index)).toEqual(expectedPositon)
    })
  })

  describe('positions', () => {
    it('returns all positions', () => {
      const grid = new Grid2D({height: 1, width: 1})
      const expectedPositions = [
        {row: 0, column: 0}
      ]
      expect(Array.from(grid.positions())).toEqual(expectedPositions)
    })
  })
})
