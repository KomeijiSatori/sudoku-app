import _ from 'lodash';

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

export { combination };
