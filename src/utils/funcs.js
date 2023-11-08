const getCellRowCol = (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
  let row = boxRowIdx * 3 + cellRowIdx;
  let col = boxColIdx * 3 + cellColIdx;
  return [row, col];
}

const getCellIdx = (row, col) => {
  let boxRowIdx = Math.floor(row / 3), boxColIdx = Math.floor(col / 3), cellRowIdx = row % 3, cellColIdx = col % 3;
  return [boxRowIdx, boxColIdx, cellRowIdx, cellColIdx];
}

const getRelatedCellPos = (row, col) => {
  let res = new Set();
  let houseRowIdx = Math.floor(row / 3), houseColIdx = Math.floor(col / 3);
  let startRow = houseRowIdx * 3, startCol = houseColIdx * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let curRow = startRow + i, curCol = startCol + j;
      res.add(JSON.stringify({row: curRow, col: curCol}));
    }
  }
  for (let i = 0; i < 9; i++) {
    res.add(JSON.stringify({row: i, col}));
  }
  for (let j = 0; j < 9; j++) {
    res.add(JSON.stringify({row, col: j}));
  }
  res.delete(JSON.stringify({ row, col }));
  return [...res].map(x => JSON.parse(x));
}

export { getCellRowCol, getCellIdx, getRelatedCellPos };
