import {
  Minesweeper,
  printField,
  fieldToString,
} from './minesweeper.js'
import { solve } from './minesweeper_solver.js'

async function main() {
  const minesToCellsRatio = 99 / (16 * 30)
  const height = 100
  const width = 100
  const mines = (width * height) * minesToCellsRatio

  const minesweeper = new Minesweeper({height, width, mines})

  printField(minesweeper._field)

  function render() {
    const $minesweeperField = document.querySelector('minesweeper-field')
    $minesweeperField.minesweeper = minesweeper
  }

  render()

  await solve(minesweeper, render)
}

main()
