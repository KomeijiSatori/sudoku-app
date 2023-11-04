class BoardHistory {
  constructor(inputCellPos, fills, candidates) {
    this.inputCellPos = inputCellPos;
    this.fills = fills;
    this.candidates = candidates;
  }
}

// algorithm based models

// { candRelated: [{row: 1, col: 2, cands: [2, 3]}, {row: 1, col: 3, cands: [2, 3]}], candRemoved: [{row: 1, col: 5, cands: [3]}] };
class CandsInfo {
  constructor(row, col, cands) {
    this.row = row;
    this.col = col;
    this.cands = cands;
  }
}

class CandResult {
  constructor(candRelated, candRemoved) {
    this.candRelated = candRelated;
    this.candRemoved = candRemoved;
  }
}

export { BoardHistory, CandsInfo, CandResult };
