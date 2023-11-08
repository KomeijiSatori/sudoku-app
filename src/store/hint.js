import { HINT_CELL_TYPES, HINT_CANDIDATE_DISPLAY_TYPES } from "@/utils/enums";
import { getCellRowCol } from "@/utils/funcs";

import { nakedCands } from '@/algorithms/nakedCands';
import { hiddenCands } from '@/algorithms/hiddenCands';
import { lineReduction } from '@/algorithms/lineReduction';
import { boxReduction } from '@/algorithms/boxReduction';

const calcHintResult = (candidates) => {
  let nakedSingles = nakedCands(candidates, 1, false);
  if (nakedSingles.length > 0) {
    return nakedSingles;
  }
  let hiddenSingles = hiddenCands(candidates, 1);
  if (hiddenSingles.length > 0) {
    return hiddenSingles;
  }
  let nakedPairs = nakedCands(candidates, 2);
  if (nakedPairs.length > 0) {
    return nakedPairs;
  }
  let hiddenPairs = hiddenCands(candidates, 2);
  if (hiddenPairs.length > 0) {
    return hiddenPairs;
  }
  let nakedTriples = nakedCands(candidates, 3);
  if (nakedTriples.length > 0) {
    return nakedTriples;
  }
  let hiddenTriples = hiddenCands(candidates, 3);
  if (hiddenTriples.length > 0) {
    return hiddenTriples;
  }
  let nakedQuads = nakedCands(candidates, 4);
  if (nakedQuads.length > 0) {
    return nakedQuads;
  }
  let hiddenQuads = hiddenCands(candidates, 4);
  if (hiddenQuads.length > 0) {
    return hiddenQuads;
  }
  let lineReductions = lineReduction(candidates);
  if (lineReductions.length > 0) {
    return lineReductions;
  }
  let boxReductions = boxReduction(candidates);
  if (boxReductions.length > 0) {
    return boxReductions;
  }
  return [];
}

const clearHintBoard = (state) => {
  state.numbers = [...Array(9)].map(() => Array(9).fill(null));
  state.candidates = [...Array(9)].map(() => [...Array(9)].map(() => []));
  state.cellDisplayTypes = [...Array(9)].map(() => Array(9).fill(null));
  state.candidateDisplayTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null)));
  state.hintResult = [];
  state.curHintInd = null;
}

export default {
  state: {
    numbers: [...Array(9)].map(() => Array(9).fill(null)),
    candidates: [...Array(9)].map(() => [...Array(9)].map(() => [])),

    cellDisplayTypes: [...Array(9)].map(() => Array(9).fill(null)),
    candidateDisplayTypes: [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null))),

    hintResult: [],
    curHintInd: null,
    showHint: false,
  },
  getters: {
    isShowHint: (state) => () => {
      return state.showHint;
    },
    getHintCellType: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      if (state.numbers[row][col] !== null) {
        return HINT_CELL_TYPES.NUMBER;
      } else {
        return HINT_CELL_TYPES.CANDIDATE;
      }
    },

    getHintCellDisplayType: (state) => (row, col) => {
      return state.cellDisplayTypes[row][col];
    },
    getHintCandidateDisplayType: (state) => (row, col, ind) => {
      return state.candidateDisplayTypes[row][col][ind];
    },

    getHintNumber: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      return state.numbers[row][col];
    },
    getHintCand: (state) => (boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) => {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      return state.candidates[row][col];
    },
    hasPrevResult: (state) => () => {
      return null !== state.curHintInd && state.curHintInd > 0;
    },
    hasNextResult: (state) => () => {
      return null !== state.curHintInd && state.curHintInd < state.hintResult.length - 1;
    }
  },
  mutations: {
    setShowHint: (state, showHint) => {
      state.showHint = showHint;
    },
    setHintDisplay: (state) => {
      let ind = state.curHintInd;
      if (ind >= state.hintResult) {
        return;
      }
      state.cellDisplayTypes = [...Array(9)].map(() => Array(9).fill(null));
      state.candidateDisplayTypes = [...Array(9)].map(() => [...Array(9)].map(() => Array(9).fill(null)));
      let result = state.hintResult[ind];
      let candRelated = result.candRelated;
      let candRemoved = result.candRemoved;
      candRelated.forEach(cellInfo => {
        let curRow = cellInfo.row, curCol = cellInfo.col, cands = cellInfo.cands;
        cands.forEach(cand => {
          state.candidateDisplayTypes[curRow][curCol][cand - 1] = HINT_CANDIDATE_DISPLAY_TYPES.EVIDANCE;
        });
      });
      candRemoved.forEach(cellInfo => {
        let curRow = cellInfo.row, curCol = cellInfo.col, cands = cellInfo.cands;
        cands.forEach(cand => {
          state.candidateDisplayTypes[curRow][curCol][cand - 1] = HINT_CANDIDATE_DISPLAY_TYPES.ELIMINATION;
        });
      });
    }
  },
  actions: {
    initHint: ({ state, rootState }) => {
      clearHintBoard(state);
      let curFacts = rootState.board.facts
      let curFills = rootState.board.fills;
      let curCands = rootState.board.candidates;
      let numbers = [...Array(9)].map(() => Array(9).fill(null));
      let candidates = [...Array(9)].map(() => [...Array(9)].map(() => []));
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (null !== curFacts[row][col]) {
            numbers[row][col] = curFacts[row][col];
          } else if (null !== curFills[row][col]) {
            numbers[row][col] = curFills[row][col];
          } else {
            candidates[row][col] = [...curCands[row][col]];
          }
        }
      }
      state.numbers = numbers;
      state.candidates = candidates;
      state.showHint = true;
    },
    calculateHints: ({ commit, state }) => {
      let curCands = state.candidates;
      let res = calcHintResult(curCands);
      if (res.length > 0) {
        state.hintResult = res;
        state.curHintInd = 0;
        commit("setHintDisplay");
      }
    },
    moveToPrevResult: ({ commit, state }) => {
      if (null !== state.curHintInd && state.curHintInd > 0) {
        state.curHintInd--;
        commit("setHintDisplay");
      }
    },
    moveToNextResult: ({ commit, state }) => {
      if (null !== state.curHintInd && state.curHintInd < state.hintResult.length - 1) {
        state.curHintInd++;
        commit("setHintDisplay");
      }
    },
  }
}
