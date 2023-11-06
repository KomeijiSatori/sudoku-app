import { getSameRowIdx, getSameColIdx } from "@/algorithms/common";
import { CandResult, CandsInfo } from '@/utils/models';

/**
 * get line reduction of numbers on same row or col of a box, also known as pointing pairs
 * @param {Array} candBoard [the candidates of all unknown cells]
 * @param {boolean} filterNonElim [whether to filter the result with empty eliminations]
 * @returns {Array[CandResult]} [the result of the line reduction]
 */
const lineReduction = (candBoard, filterNonElim = true) => {
  let res = [];
  for (let boxInd = 0; boxInd < 9; boxInd++) {
    let startRow = Math.floor(boxInd / 3) * 3, startCol = (boxInd % 3) * 3;
    let candsPos = [...Array(9)].map(() => []);
    for (let offsetRow = 0; offsetRow < 3; offsetRow++) {
      for (let offsetCol = 0; offsetCol < 3; offsetCol++) {
        let curRow = startRow + offsetRow, curCol = startCol + offsetCol;
        let curCands = candBoard[curRow][curCol];
        curCands.forEach(cand => {
          candsPos[cand - 1].push({row: curRow, col: curCol});
        });
      }
    }
    for (let cand = 1; cand <= 9; cand++) {
      let curNumPosAry = candsPos[cand - 1];
      // check row
      let sameRowIdx = getSameRowIdx(curNumPosAry);
      if (null !== sameRowIdx) {
        let boxCols = curNumPosAry.map(curPos => curPos.col);
        let relatedCands = boxCols.map(col => new CandsInfo(sameRowIdx, col, [cand]));
        let removedCands = [];
        for (let col = 0; col < 9; col++) {
          if (!boxCols.includes(col) && candBoard[sameRowIdx][col].includes(cand)) {
            removedCands.push(new CandsInfo(sameRowIdx, col, [cand]));
          }
        }
        res.push(new CandResult(relatedCands, removedCands));
        continue;
      }
      // check col
      let sameColIdx = getSameColIdx(curNumPosAry);
      if (null !== sameColIdx) {
        let boxRows = curNumPosAry.map(curPos => curPos.row);
        let relatedCands = boxRows.map(row => new CandsInfo(row, sameColIdx, [cand]));
        let removedCands = [];
        for (let row = 0; row < 9; row++) {
          if (!boxRows.includes(row) && candBoard[row][sameColIdx].includes(cand)) {
            removedCands.push(new CandsInfo(row, sameColIdx, [cand]));
          }
        }
        res.push(new CandResult(relatedCands, removedCands));
      }
    }
  }
  // filter results with no eliminations
  if (filterNonElim) {
    res = res.filter(candResult => candResult.candRemoved.map(candsInfo => candsInfo.cands.length > 0).reduce((prev, cur) => prev | cur, false));
  }
  return res;
}

export { lineReduction }

// let cands = [
//   [[7, 8, 9], [], [], [4, 7, 8], [4, 5, 7, 8], [], [], [4, 5, 8, 9], [7, 8]],
//   [[], [], [5, 6, 8, 9], [2, 3, 7, 8], [3, 5, 7, 8], [2, 3, 5, 7], [2, 3, 6, 7, 9], [2, 3, 5, 8, 9], [2, 3, 6, 7, 8]],
//   [[6, 7, 8], [7, 8], [5, 6, 8], [], [3, 4, 5, 7, 8], [], [2, 3, 4, 6, 7], [2, 3, 4, 5, 8], [2, 3, 6, 7, 8]],
//   [[], [2, 7, 8], [1, 8], [1, 6], [], [3, 7], [2, 3, 6], [2, 3, 8], []],
//   [[2, 8, 9], [], [4, 8, 9], [3, 4, 8], [3, 4, 5, 8], [3, 4, 5], [2, 3, 9], [], []],
//   [[], [4, 7, 8, 9], [1, 4, 8, 9], [1, 6], [], [4, 7], [6, 9], [8, 9], []],
//   [[1, 2, 6, 9], [2, 4, 9], [1, 3, 4, 6, 9], [], [1, 3, 4, 6, 7], [], [2, 3, 4, 7], [2, 3, 4], [2, 3, 7]],
//   [[2, 6, 8], [2, 4, 8], [3, 4, 6, 8], [2, 3, 4, 7], [3, 4, 6, 7], [2, 3, 4, 7], [], [], []],
//   [[1, 2], [], [], [2, 3, 4], [1, 3, 4], [], [], [], [2, 3]]
// ];
// let res = lineReduction(cands);
// console.log(res);
