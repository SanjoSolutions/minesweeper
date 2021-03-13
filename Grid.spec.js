import { Grid } from './Grid.js'

describe('Grid', () => {
  describe('get and set', () => {
    it('gets and sets values', () => {
      const grid = new Grid([2, 2])
      grid.set([0, 0], 0)
      grid.set([1, 0], 1)
      grid.set([0, 1], 2)
      grid.set([1, 1], 3)
      expect(grid.get([0, 0])).toEqual(0)
      expect(grid.get([1, 0])).toEqual(1)
      expect(grid.get([0, 1])).toEqual(2)
      expect(grid.get([1, 1])).toEqual(3)
    })
  })

  describe('calculatePosition', () => {
    const testData = [
      {
        index: 0,
        expectedPosition: [0, 0, 0]
      },
      {
        index: 1,
        expectedPosition: [1, 0, 0]
      },
      {
        index: 3,
        expectedPosition: [0, 1, 0]
      },
      {
        index: 12,
        expectedPosition: [0, 0, 1]
      }
    ]
    for (const {index, expectedPosition} of testData) {
      it(
        'calculates the position ' +
        `${arrayToString(expectedPosition)} for index ${index}`,
        () => {
          const grid = new Grid([3, 4, 5])
          expect(grid.calculatePosition(index)).toEqual(expectedPosition)
      })
    }
  })

  describe('positions', () => {
    it('returns all positions', () => {
      const grid = new Grid([2, 3, 4])
      const expectedPositions = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        [0, 2, 0],
        [1, 2, 0],
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
        [0, 2, 1],
        [1, 2, 1],
        [0, 0, 2],
        [1, 0, 2],
        [0, 1, 2],
        [1, 1, 2],
        [0, 2, 2],
        [1, 2, 2],
        [0, 0, 3],
        [1, 0, 3],
        [0, 1, 3],
        [1, 1, 3],
        [0, 2, 3],
        [1, 2, 3]
      ]
      expect(Array.from(grid.positions())).toEqual(expectedPositions)
    })
  })
})

function arrayToString(array) {
  return JSON.stringify(array).replace(/,/g, ', ')
}
