import _ from 'lodash';

import { CELL_TYPES } from "@/utils/enums";
import { CELL_DISPLAY_TYPES, CANDIDATE_DISPLAY_TYPES } from "@/utils/enums";
import { getCellRowCol, getRelatedCellPos } from "@/utils/funcs";
import { CircularCache } from "@/utils/CircularCache";
import { BoardHistory } from '@/utils/models';


const cacheSize = 50;


export default {
  state: {
    facts: [...Array(9)].map(() => Array(9).fill(null)),
    fills: [...Array(9)].map(() => Array(9).fill(null)),
    candidates: [...Array(9)].map(() => [...Array(9)].map(() => [])),

    cellDisplayTypes: [...Array(9)].map(() => Array(9).fill(null)),
    candidateDisplayTypes: [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null))),

    selectedCell: null,

    boardHistory: new CircularCache(cacheSize),
  },
  getters: {
    getCellType: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      if (state.facts[row][col] !== null) {
        return CELL_TYPES.FACT;
      } else if (state.fills[row][col] !== null) {
        return CELL_TYPES.FILL;
      } else {
        return CELL_TYPES.CANDIDATE;
      }
    },
    getFactCell: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      return state.facts[row][col];
    },
    getFillCell: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      return state.fills[row][col];
    },
    getCandCell: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      return state.candidates[row][col];
    },

    getCellDisplayType: (state) => (row, col) => {
      return state.cellDisplayTypes[row][col];
    },
    getCandidateDisplayType: (state) => (row, col, ind) => {
      return state.candidateDisplayTypes[row][col][ind];
    },

    getSelectedCell: (state) => () => {
      return state.selectedCell;
    }
  },
  mutations: {
    initBoard: (state) => {
      state.boardHistory.push(new BoardHistory(null, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },
    loadBoard: (state, factBoard) => {
      state.facts = _.cloneDeep(factBoard);
      state.fills = [...Array(9)].map(() => Array(9).fill(null));
      state.candidates = [...Array(9)].map(() => [...Array(9)].map(() => []));
      state.cellDisplayTypes = [...Array(9)].map(() => Array(9).fill(null)),
      state.candidateDisplayTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null))),
      state.selectedCell = null;
      state.boardHistory = new CircularCache(cacheSize);
      state.boardHistory.push(new BoardHistory(null, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },
    // equal to string: 708002100003678900002050008025904687046587010807206000604720801201003500009060004
    // initBoard(state) {
    //   state.facts = [
    //     [7, null, null, null, null, null, 1, null, null],
    //     [null, null, 3, 6, null, null, 9, null, null],
    //     [null, null, 2, null, 5, null, null, null, 8],
    //     [null, null, null, 9, null, 4, null, null, 7],
    //     [null, 4, null, 5, null, 7, null, 1, null],
    //     [8, null, null, 2, null, 6, null, null, null],
    //     [6, null, null, null, 2, null, 8, null, null],
    //     [null, null, 1, null, null, 3, 5, null, null],
    //     [null, null, 9, null, null, null, null, null, 4]
    //   ];
    //   state.fills = [
    //     [null, null, 8, null, null, 2, null, null, null],
    //     [null, null, null, null, 7, 8, null, null, null],
    //     [null, null, null, null, null, null, null, null],
    //     [null, 2, 5, null, null, null, 6, 8, null],
    //     [null, null, 6, null, 8, null, null, null, null],
    //     [null, null, 7, null, null, null, null, null, null],
    //     [null, null, 4, 7, null, null, null, null, 1],
    //     [2, null, null, null, null, null, null, null, null],
    //     [null, null, null, null, 6, null, null, null, null]
    //   ];
    //   state.candidates = [
    //     [[], [5, 6, 9], [], [3, 4], [4, 9], [], [], [3, 4, 5, 6], [3, 5, 6]],
    //     [[1, 4, 5], [1, 5], [], [], [], [], [], [2, 4, 5], [2, 5]],
    //     [[4, 9], [6, 9], [], [1, 3, 4], [], [1, 9], [3, 4, 7], [3, 4, 6, 7], []],
    //     [[1, 3], [], [], [], [1, 3], [], [], [], []],
    //     [[3, 9], [], [], [], [], [], [2, 3], [], [2, 3, 9]],
    //     [[], [1, 3, 9], [], [], [1, 3], [], [3, 4], [3, 4, 5, 9], [3, 5, 9]],
    //     [[], [3, 5], [], [], [], [5, 9], [], [3, 9], []],
    //     [[], [7, 8], [], [4, 8], [4, 9], [], [], [6, 7, 9], [6, 9]],
    //     [[3, 5], [7, 8], [], [1, 8], [], [1, 5], [2, 3, 7], [2, 3, 7], []]
    //   ];
    //   state.boardHistory.push(new BoardHistory(null, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    // },

    setCellFocused: (state, position) => {
      // if it is a clear request
      if (null === position) {
        state.selectedCell = null;
        state.cellDisplayTypes = [...Array(9)].map(() => Array(9).fill(null));
        state.candidateDisplayTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null)));
        return;
      }
      let { row, col } = position;
      state.selectedCell = { row, col };

      let nextCellTypes = [...Array(9)].map(() => Array(9).fill(null));
      let nextCandidateTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null)));

      let fillWithPosRelatedCells = (r, c) => {
        let relatedCellsPos = getRelatedCellPos(r, c);
        relatedCellsPos.forEach(({ row, col }) => {
          nextCellTypes[row][col] = CELL_DISPLAY_TYPES.RELATED_POS;
        });
      }

      // if it is a fact cell or fill cell
      let factVal = state.facts[row][col];
      let fillVal = state.fills[row][col];
      if (null !== factVal || null !== fillVal) {
        // select the cells with the same value
        let val = null !== factVal ? factVal : fillVal;
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            let curFactVal = state.facts[i][j];
            let curFillVal = state.fills[i][j];
            if (val === curFactVal || val === curFillVal) {
              nextCellTypes[i][j] = CELL_DISPLAY_TYPES.SAME_VALUE;
            }
          }
        }
        // select the cells with related position
        fillWithPosRelatedCells(row, col);
        // select the current cell
        nextCellTypes[row][col] = CELL_DISPLAY_TYPES.SELETED;
        // select related candidates
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            let candValAry = state.candidates[i][j];
            if (null !== candValAry && candValAry.includes(val)) {
              nextCandidateTypes[i][j][val - 1] = CANDIDATE_DISPLAY_TYPES.RELATED;
            }
          }
        }
      } else {
        // then it is a candidate cell
        // select the current cell
        fillWithPosRelatedCells(row, col);
        nextCellTypes[row][col] = CELL_DISPLAY_TYPES.SELETED;
      }
      state.cellDisplayTypes = nextCellTypes;
      state.candidateDisplayTypes = nextCandidateTypes;
    },

    inputValue: (state, { row, col, val }) => {
      // avoid fact cell and duplicate value filling
      if (state.facts[row][col] !== null || state.fills[row][col] === val) {
        return;
      }
      // fill in the current cell
      state.candidates[row][col] = [];
      state.fills[row][col] = val;
      // auto remove candidates in cells with related position
      let relatedCellsPos = getRelatedCellPos(row, col);
      relatedCellsPos.forEach(({ row, col }) => {
        let curCands = state.candidates[row][col];
        state.candidates[row][col] = curCands.filter(num => num !== val);
      });
      // save the current board
      state.boardHistory.push(new BoardHistory({ row, col }, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },

    inputCandidate: (state, { row, col, val }) => {
      // avoid fact cell
      if (state.facts[row][col] !== null) {
        return;
      }
      let curFill = state.fills[row][col];
      let curCands = state.candidates[row][col];
      if (null !== curFill) {
        state.fills[row][col] = null;
        state.candidates[row][col].push(val);
      } else if (curCands.includes(val)) {
        state.candidates[row][col] = curCands.filter(num => num !== val);
      } else {
        state.candidates[row][col].push(val);
      }
      // save the current board
      state.boardHistory.push(new BoardHistory({ row, col }, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },

    eraseCell: (state, { row, col }) => {
      let curFill = state.fills[row][col];
      let curCands = state.candidates[row][col];
      if (null !== curFill) {
        state.fills[row][col] = null;
      } else if (curCands.length > 0) {
        state.candidates[row][col] = [];
      } else {
        return;
      }
      // save the current board
      state.boardHistory.push(new BoardHistory({ row, col }, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },

    resetBoard: (state) => {
      state.fills = [...Array(9)].map(() => Array(9).fill(null));
      state.candidates = [...Array(9)].map(() => [...Array(9)].map(() => []));
      state.cellDisplayTypes = [...Array(9)].map(() => Array(9).fill(null)),
      state.candidateDisplayTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null))),
      state.selectedCell = null;
      state.boardHistory = new CircularCache(cacheSize);
      state.boardHistory.push(new BoardHistory(null, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },

    autoFillCandidates: (state) => {
      // if the board has no modifications, then is able to auto fill
      if (state.boardHistory.hasPrev()) {
        return;
      }
      let nextCandidates = [...Array(9)].map(() => [...Array(9)].map(() => []));
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (null === state.fills[i][j]) {
            let curCands = nextCandidates[i][j];
            let isExist = Array(9).fill(false);
            let relatedCellsPos = getRelatedCellPos(i, j);
            relatedCellsPos.forEach(({ row, col }) => {
              if (null !== state.facts[row][col]) {
                isExist[state.facts[row][col] - 1] = true;
              }
            })
            for (let cand = 1; cand <= 9; cand++) {
              if (!isExist[cand - 1]) {
                curCands.push(cand);
              }
            }
          }
        }
      }
      state.candidates = nextCandidates;
      // save the current board
      state.boardHistory.push(new BoardHistory(null, _.cloneDeep(state.fills), _.cloneDeep(state.candidates)));
    },

    undoBoard: (state) => {
      let prevStep = state.boardHistory.movePrev();
      if (null === prevStep) {
        return;
      }
      let prevPos = prevStep.inputCellPos, prevFills = prevStep.fills, prevCandidates = prevStep.candidates;
      state.fills = _.cloneDeep(prevFills);
      state.candidates = _.cloneDeep(prevCandidates);
      state.selectedCell = _.cloneDeep(prevPos);
    },

    redoBoard: (state) => {
      let nextStep = state.boardHistory.moveNext();
      if (null === nextStep) {
        return;
      }
      let nextPos = nextStep.inputCellPos, nextFills = nextStep.fills, nextCandidates = nextStep.candidates;
      state.fills = _.cloneDeep(nextFills);
      state.candidates = _.cloneDeep(nextCandidates);
      state.selectedCell = _.cloneDeep(nextPos);
    }
  }
}
