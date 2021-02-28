import {
  Minesweeper,
  printField,
  fieldToString,
} from './minesweeper.js'
import { solve } from './minesweeper_solver.js'

async function main() {
  const height = 24
  const width = 30
  const mines = 150

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
