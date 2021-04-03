import {
  Minesweeper,
  printField,
  fieldToString,
} from './minesweeper.js'
import { solve } from './minesweeper_solver.js'
import { MinesweeperCell } from './MinesweeperCell.js'

async function main() {
  const minesToCellsRatio = 99 / (16 * 30)
  const height = 100
  const width = 100
  const mines = (width * height) * minesToCellsRatio

  const minesweeper = new Minesweeper({height, width, mines})
  const $minesweeperField = document.querySelector('minesweeper-field')

  $minesweeperField.addEventListener('pointerup', (event) => {
    console.log(event)
    const element = event.composedPath()[0]
    if (element instanceof MinesweeperCell) {
      const $minesweeperCell = element
      const $minesweeperCells = $minesweeperField.getCells()
      const index = $minesweeperCells.indexOf($minesweeperCell)
      const {row, column} = minesweeper.field.calculatePosition(index)
      if (event.button === 0) {
        minesweeper.reveal({row, column})
      } else if (event.button === 2) {
        minesweeper.toggleFlagAsMine({row, column})
      }
      render()
    }
  })

  $minesweeperField.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })

  function render() {
    $minesweeperField.minesweeper = minesweeper
  }

  render()
}

main()
