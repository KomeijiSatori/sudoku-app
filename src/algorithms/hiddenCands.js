import _ from 'lodash';

import { CandResult, CandsInfo } from '@/utils/models';
import { combination, mergeResult, filterNonElimResult } from '@/algorithms/common';


/**
 * get hidden candidates of the position related 9 cells
 * @param {Array} cellCands [candidates of 9 cells in the same row/col/box]
 * @param {number} cnt [the count of cells to be selected]
 * @param {function} indToPosFunc [the map function map the index of candidates ary to board position (row / col)]
 * @returns {Array[CandResult]} [the result of the hidden candidates]
 */
const getCandResult = (cellCands, cnt, indToPosFunc) => {
  if (cellCands.length != 9) {
    return null;
  }
  let indAry = [];
  for (let i = 0; i < 9; i++) {
    if (cellCands[i].length > 0) {
      indAry.push(i);
    }
  }
  let numExistance = [...Array(9)].map(() => []);
  for (let i = 0; i < indAry.length; i++) {
    cellCands[indAry[i]].forEach(cand => {
      numExistance[cand - 1].push(indAry[i]);
    });
  }
  let comb = combination(cnt, 9);
  let res = [];
  let itr = comb.next();
  while (!itr.done) {
    let selectedNums = itr.value.map(i => i + 1);
    let numsExistStatus = selectedNums.map(num => numExistance[num - 1]);
    let isNumsExist = numsExistStatus.map(numStatus => numStatus.length > 0).reduce((prev, cur) => prev & cur, true);
    let totalExistance = _.union(...numsExistStatus);
    if (isNumsExist && totalExistance.length === cnt) {
      let relatedCandsInfo = totalExistance.map(ind => {
        let { row, col } = indToPosFunc(ind);
        return new CandsInfo(row, col, selectedNums);
      });
      let removedCandsInfo = totalExistance.map(ind => {
        let { row, col } = indToPosFunc(ind);
        let removedCands = _.difference(cellCands[ind], selectedNums)
        return new CandsInfo(row, col, removedCands);
      });
      res.push(new CandResult(relatedCandsInfo, removedCandsInfo));
    }
    itr = comb.next();
  }
  return res;
}


/**
 * get hidden candidates of the board
 * @param {Array} candBoard [the candidates of all unknown cells]
 * @param {number} cnt [the number of the combination, ie: 1 for hidden single, 2 for hidden pairs, 3 for hidden triples, .etc]
 * @param {boolean} filterNonElim [whether to filter the result with empty eliminations]
 * @returns {Array[CandResult]} [the result of the hidden candidates]
 */
const hiddenCands = (candBoard, cnt, filterNonElim = true) => {
  let res = [];
  // check rows
  for (let rowInd = 0; rowInd < 9; rowInd++) {
    const mapFunc = (ind) => {
      return { row: rowInd, col: ind };
    }
    let curCells = candBoard[rowInd];
    res = _.union(res, getCandResult(curCells, cnt, mapFunc));
  }
  // check cols
  for (let colInd = 0; colInd < 9; colInd++) {
    const mapFunc = (ind) => {
      return { row: ind, col: colInd };
    }
    let curCells =[...Array(9).keys()].map(rowInd => {
      return candBoard[rowInd][colInd];
    });
    res = _.union(res, getCandResult(curCells, cnt, mapFunc));
  }
  // check boxes
  for (let boxInd = 0; boxInd < 9; boxInd++) {
    const rowStartInd = Math.floor(boxInd / 3) * 3;
    const colStartInd = boxInd % 3 * 3;
    const mapFunc = (ind) => {
      let rowOffset = Math.floor(ind / 3);
      let colOffset = ind % 3;
      return { row: rowStartInd + rowOffset, col: colStartInd + colOffset };
    }
    let curCells =[...Array(9).keys()].map(cellInd => {
      let rowOffset = Math.floor(cellInd / 3);
      let colOffset = cellInd % 3;
      return candBoard[rowStartInd + rowOffset][colStartInd + colOffset];
    });
    res = _.union(res, getCandResult(curCells, cnt, mapFunc));
  }
  res = _.uniqBy(res, JSON.stringify);
  res = mergeResult(res);
  // filter results with no eliminations
  if (filterNonElim) {
    res = filterNonElimResult(res);
  }
  return res;
}

export { hiddenCands };

// let cands = [
//   [[], [], [5, 6], [], [1, 9], [], [1, 5, 6, 9], [], [1, 6, 9]],
//   [[5, 6, 9], [], [3, 5, 6], [1, 3, 5], [1, 2, 9], [2, 5], [1, 5, 6, 9], [], []],
//   [[], [3, 5, 9], [], [3, 5], [], [], [], [5, 9], []],
//   [[], [], [2, 4, 5, 6], [], [], [], [5, 6], [2, 5, 6], [4, 6]],
//   [[6, 9], [3, 7, 9], [2, 3, 4, 6, 7], [], [], [], [3, 6, 7, 9], [2, 6, 9], [4, 6, 9]],
//   [[5, 9], [3, 5, 7, 9], [3, 5, 7], [], [], [], [1, 3, 5, 7, 9], [], [1, 9]],
//   [[], [5, 7], [], [], [], [5, 7], [], [], []],
//   [[], [], [5, 7], [1, 5], [1, 2], [2, 5, 7], [6, 9], [6, 9], []],
//   [[], [], [], [], [], [], [], [], []]
// ];
// let res = hiddenCands(cands, 2);
// console.log(res);
