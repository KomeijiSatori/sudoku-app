import _ from 'lodash';

import { CandResult } from '@/utils/models';

/**
 * select m elements from array of size n, return the index of selected items per iteration
 * @param {Array} m [the numbers of elements to be selected]
 * @param {Array} n [the size of the array]
 * @returns {Array} [the index of the selected items]
 */
function* combination(m, n) {
  if (m > n || m <= 0) {
    return [];
  }
  let indexStack = [0];
  while (indexStack.length > 0) {
    if (m === indexStack.length) {
      yield _.cloneDeep(indexStack);
      indexStack[indexStack.length - 1]++;
      let maxInd = n - m + indexStack.length - 1;
      while (indexStack[indexStack.length - 1] > maxInd) {
        indexStack.pop();
        if (indexStack.length === 0) {
          break;
        }
        indexStack[indexStack.length - 1]++;
        maxInd = n - m + indexStack.length - 1;
      }
    } else {
      indexStack.push(indexStack[indexStack.length - 1] + 1);
    }
  }
}

/**
 * judge if candidates is on the same row, if so, return the row id, otherwise null
 * @param {Array} candsPos [the position of the candidates]
 * @returns {Number} [the index of the row]
 */
function getSameRowIdx(candsPos) {
  if (candsPos.length === 0) {
    return null;
  }
  return candsPos
  .map(candPos => candPos.row)
  .reduce((prev, cur) => prev === cur ? cur : null);
}

/**
 * judge if candidates is on the same col, if so, return the col id, otherwise null
 * @param {Array} candsPos [the position of the candidates]
 * @returns {Number} [the index of the col]
 */
function getSameColIdx(candsPos) {
  if (candsPos.length === 0) {
    return null;
  }
  return candsPos
  .map(candPos => candPos.col)
  .reduce((prev, cur) => prev === cur ? cur : null);
}

/**
 * judge if candidates is on the same box, if so, return the box id, otherwise null
 * @param {Array} candsPos [the position of the candidates]
 * @returns {Number} [the index of the box]
 */
function getSameBoxIdx(candsPos) {
  if (candsPos.length === 0) {
    return null;
  }
  return candsPos
  .map(candPos => {
    return Math.floor(candPos.row / 3) * 3 + Math.floor(candPos.col / 3);
  })
  .reduce((prev, cur) => prev === cur ? cur : null);
}


function mergeResult(candResults) {
  return _.values(_.groupBy(candResults, result => {
    return _.sortBy(result.candRelated, JSON.stringify)
      .map(candInfo => `${candInfo.row} ${candInfo.col} ${_.sortBy(candInfo.cands).join(',')}`)
  })).map(sameCandRelatedResults => {
    let candRealted = sameCandRelatedResults[0].candRelated;
    let candRemoved = _.uniqBy(sameCandRelatedResults
        .map(result => _.sortBy(result.candRemoved)), JSON.stringify)
      .flat();
    return new CandResult(candRealted, candRemoved);
  })
}

function filterNonElimResult(candResults) {
  return candResults
    .filter(candResult => candResult.candRemoved
      .map(candsInfo => candsInfo.cands.length > 0)
      .reduce((prev, cur) => prev | cur, false)
    );
}

export { combination, getSameRowIdx, getSameColIdx, getSameBoxIdx, mergeResult, filterNonElimResult };
