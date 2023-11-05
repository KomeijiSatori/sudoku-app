import _ from 'lodash';

import { CandResult, CandsInfo } from '@/utils/models';
import { combination } from '@/algorithms/common';


class CandsIndInfo {
  constructor(ind, cands) {
    this.ind = ind;
    this.cands = cands;
  }
}
  
class CandIndResult {
  constructor(candRelated, candRemoved) {
    this.candRelated = candRelated;
    this.candRemoved = candRemoved;
  }
}

/**
 * check if the selected candidates meets the requirement of naked pairs and return the result
 * @param {Array} candAry [the array of candidates to be checked]
 * @param {Array} selectedInds [the index of cells to be selected]
 * @returns {Array[CandIndResult]} [the result of the naked candidates]
 */
const getCandIndResult = (candAry, selectedInds) => {
  let allCands = new Set();
  selectedInds
    .map(ind => candAry[ind])
    .forEach(curCands => {
      curCands.forEach(cand => {
        allCands.add(cand);
      })
    });
  if (allCands.size === selectedInds.length) {
    // assemble candRelated
    let candRelated = selectedInds.map(ind => new CandsIndInfo(ind, candAry[ind]));
    // assemble candRemoved
    let candRemoved = [];
    for (let i = 0; i < candAry.length; i++) {
      if (!selectedInds.includes(i)) {
        let removedCand = _.intersection(candAry[i], Array.from(allCands));
        if (removedCand.length > 0) {
          candRemoved.push(new CandsIndInfo(i, removedCand));
        }
      }
    }
    return new CandIndResult(candRelated, candRemoved);
  }
  return null;
}

/**
 * get naked candidates of the position related 9 cells
 * @param {Array} cellCands [candidates of 9 cells in the same row/col/box]
 * @param {number} cnt [the count of cells to be selected]
 * @param {function} indToPosFunc [the map function map the index of candidates ary to board position (row / col)]
 * @returns {Array[CandResult]} [the result of the naked candidates]
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
  let comb = combination(cnt, indAry.length);
  let res = [];
  let itr = comb.next();
  while (!itr.done) {
    let selectedInds = itr.value.map(i => indAry[i]);
    let candIndResult = getCandIndResult(cellCands, selectedInds);
    if (null !== candIndResult) {
      let relatedCandsInfo = candIndResult.candRelated.map(candsIndInfo => {
        let { row, col } = indToPosFunc(candsIndInfo.ind);
        return new CandsInfo(row, col, candsIndInfo.cands);
      });
      let removedCandsInfo = candIndResult.candRemoved.map(candsIndInfo => {
        let { row, col } = indToPosFunc(candsIndInfo.ind)
        return new CandsInfo(row, col, candsIndInfo.cands);
      });
      res.push(new CandResult(relatedCandsInfo, removedCandsInfo));
    }
    itr = comb.next();
  }
  return res;
}

/**
 * get naked candidates of the board
 * @param {Array} candBoard [the candidates of all unknown cells]
 * @param {number} cnt [the number of the combination, ie: 1 for naked single, 2 for naked pairs, 3 for naked triples, .etc]
 * @param {boolean} filterNonElim [whether to filter the result with empty eliminations]
 * @returns {Array[CandResult]} [the result of the naked candidates]
 */
const nakedCands = (candBoard, cnt, filterNonElim = true) => {
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
  // filter results with no eliminations
  if (filterNonElim) {
    res = res.filter(candResult => candResult.candRemoved.map(candsInfo => candsInfo.cands.length > 0).reduce((prev, cur) => prev | cur, false));
  }
  return res;
}

export { nakedCands };

// let cands = [
//   [[1, 4, 6, 7], [], [5, 6, 7], [1, 2, 4, 5, 7], [], [1, 2], [2, 4, 7], [], [2, 4]],
//   [[1, 4, 7], [], [5, 7], [1, 2, 4, 5, 7], [1, 2, 7, 8], [1, 2, 8], [2, 4, 7], [], []],
//   [[], [4, 7], [], [4, 7], [], [], [], [], []],
//   [[6, 7], [], [6, 7], [], [1, 3], [], [], [], [1, 3]],
//   [[], [], [], [], [2, 3], [], [2, 3], [], []],
//   [[], [], [], [], [1, 2], [], [], [], [1, 2]],
//   [[], [], [], [1, 2], [], [1, 2], [], [], []],
//   [[], [4, 7], [7, 8, 9], [3, 7], [3, 7, 8], [6, 8, 9], [3, 4, 6], [], []],
//   [[4, 7], [], [7, 8, 9], [3, 7], [], [6, 8, 9], [3, 4, 6], [], [3, 4]]
// ];
// let res = nakedCands(cands, 2);
// console.log(res);
