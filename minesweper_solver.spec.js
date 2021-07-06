import { FLAGGED_AS_MINE, MINE, Minesweeper } from "./minesweeper.js";
import { createDiscountedField, patterns, solve } from "./minesweeper_solver.js";

describe("patterns", () => {
  describe("is determined as mine pattern", () => {
    test.only("a", async () => {
      const minesweeper = new Minesweeper({ width: 3, height: 4, mines: 4 });
      minesweeper._field.set({ row: 0, column: 0 }, 1);
      minesweeper._field.set({ row: 0, column: 1 }, MINE);
      minesweeper._field.set({ row: 0, column: 2 }, MINE);
      minesweeper._field.set({ row: 1, column: 0 }, 1);
      minesweeper._field.set({ row: 1, column: 1 }, 3);
      minesweeper._field.set({ row: 1, column: 2 }, MINE);
      minesweeper._field.set({ row: 2, column: 0 }, 1);
      minesweeper._field.set({ row: 2, column: 1 }, 2);
      minesweeper._field.set({ row: 2, column: 2 }, 1);
      minesweeper._field.set({ row: 3, column: 0 }, 1);
      minesweeper._field.set({ row: 3, column: 1 }, MINE);
      minesweeper._field.set({ row: 3, column: 2 }, 1);
      minesweeper.reveal({ row: 0, column: 0 });
      minesweeper.flagAsMine({ row: 0, column: 1 });
      minesweeper.flagAsMine({ row: 0, column: 2 });
      minesweeper.reveal({ row: 1, column: 0 });
      minesweeper.reveal({ row: 1, column: 1 });
      minesweeper.reveal({ row: 2, column: 0 });
      minesweeper.reveal({ row: 2, column: 1 });
      minesweeper.reveal({ row: 3, column: 0 });
      minesweeper.flagAsMine({ row: 3, column: 1 });
      const discountedField = createDiscountedField(minesweeper.field);
      let aPatternMatches = false;
      for (let row = 0; row < minesweeper.field.height; row++) {
        for (let column = 0; column < minesweeper.field.width; column++) {
          for (const pattern of patterns) {
            if (pattern.matches(minesweeper, discountedField, { row, column })) {
              aPatternMatches = true;
            }
          }
        }
      }
      expect(minesweeper.isRevealed({ row: 3, column: 2 }))
        .toEqual(true);
    });
  });
});
