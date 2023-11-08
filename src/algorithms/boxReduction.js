import { getSameBoxIdx, mergeResult, filterNonElimResult } from "@/algorithms/common";
import { CandResult, CandsInfo } from '@/utils/models';

/**
 * get box reduction of numbers on same row or col and in the same box
 * @param {Array} candBoard [the candidates of all unknown cells]
 * @param {boolean} filterNonElim [whether to filter the result with empty eliminations]
 * @returns {Array[CandResult]} [the result of the box reduction]
 */

const boxReduction = (candBoard, filterNonElim = true) => {
  let res = [];
  // check row
  for (let rowInd = 0; rowInd < 9; rowInd++) {
    let candsPos = [...Array(9)].map(() => []);
    for (let col = 0; col < 9; col++) {
      candBoard[rowInd][col].forEach(cand => {
        candsPos[cand - 1].push({ row: rowInd, col: col});
      });
    }
    for (let cand = 1; cand <= 9; cand++) {
      let curNumPosAry = candsPos[cand - 1];
      // check if they are in the same box
      let sameBoxInd = getSameBoxIdx(curNumPosAry);
      if (null !== sameBoxInd) {
        let relatedCands = curNumPosAry.map(curPos => new CandsInfo(curPos.row, curPos.col, [cand]));
        let startRow = Math.floor(sameBoxInd / 3) * 3, startCol = (sameBoxInd % 3) * 3;
        let removedCands = [];
        for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
          let curRow = startRow + rowOffset;
          if (curRow === rowInd) {
            continue;
          }
          for (let colOffset = 0; colOffset < 3; colOffset++) {
            let curCol = startCol + colOffset;
            if (candBoard[curRow][curCol].includes(cand)) {
              removedCands.push(new CandsInfo(curRow, curCol, [cand]));
            }
          }
        }
        res.push(new CandResult(relatedCands, removedCands));
      }
    }
  }
  // check col
  for (let colInd = 0; colInd < 9; colInd++) {
    let candsPos = [...Array(9)].map(() => []);
    for (let row = 0; row < 9; row++) {
      candBoard[row][colInd].forEach(cand => {
        candsPos[cand - 1].push({ row: row, col: colInd});
      });
    }
    for (let cand = 1; cand <= 9; cand++) {
      let curNumPosAry = candsPos[cand - 1];
      // check if they are in the same box
      let sameBoxInd = getSameBoxIdx(curNumPosAry);
      if (null !== sameBoxInd) {
        let relatedCands = curNumPosAry.map(curPos => new CandsInfo(curPos.row, curPos.col, [cand]));
        let startRow = Math.floor(sameBoxInd / 3) * 3, startCol = (sameBoxInd % 3) * 3;
        let removedCands = [];
        for (let colOffset = 0; colOffset < 3; colOffset++) {
          let curCol = startCol + colOffset;
          if (curCol === colInd) {
            continue;
          }
          for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
            let curRow = startRow + rowOffset;
            if (candBoard[curRow][curCol].includes(cand)) {
              removedCands.push(new CandsInfo(curRow, curCol, [cand]));
            }
          }
        }
        res.push(new CandResult(relatedCands, removedCands));
      }
    }
  }
  res = mergeResult(res);
  // filter results with no eliminations
  if (filterNonElim) {
    res = filterNonElimResult(res);
  }
  return res;
}

export { boxReduction }

// let cands = [
//   [[6, 8], [], [6, 8], [], [], [], [], [], []],
//   [[], [1, 3], [], [1, 5, 7, 8], [1, 2, 7], [1, 5, 7], [], [2, 3], [2, 8]],
//   [[], [], [1, 3], [1, 6, 8], [1, 2, 6], [1, 6], [3, 8, 9], [], [2, 8, 9]],
//   [[], [1, 3, 6, 7], [1, 3, 6, 7, 9], [], [], [1, 6, 7, 9], [1, 9], [2, 7, 9], [2, 6, 7, 9]],
//   [[], [1, 6, 7, 8], [1, 6, 7, 8, 9], [1, 6, 7], [1, 6, 7, 9], [1, 6, 7, 9], [], [], []],
//   [[], [1, 6, 7], [1, 6, 7, 9], [], [], [], [1, 8, 9], [7, 9], [6, 7, 8, 9]],
//   [[3, 6], [], [], [5, 6, 7], [3, 6, 7, 9], [5, 6, 7, 9], [3, 9], [], []],
//   [[1, 3, 8], [3, 7, 8], [], [1, 7], [1, 3, 7, 9], [], [], [], [7, 9]],
//   [[1, 3, 6], [], [3, 6, 7], [], [1, 3, 6, 7], [], [], [3, 7], []]
// ];
// let res = boxReduction(cands);
// console.log(res);
