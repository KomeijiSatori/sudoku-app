import puzzles from "@/data/puzzles.json";


export default {
  state: {
    puzzles: [],
  },
  getters: {
    getPuzzleStr: (state) => (index) => {
      if (index >= 0 && index < state.puzzles.length) {
        return state.puzzles[index];
      }
      return null;
    },
    getPuzzleCount: (state) => () => {
      return state.puzzles.length;
    },
  },
  mutations: {
    initPuzzle: (state) => {
      state.puzzles = puzzles;
    },
  },
}
