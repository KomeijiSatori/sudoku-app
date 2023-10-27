<template>
  <table class="mainboard">
    <tbody>
      <tr v-for="boxRowIdx in [...Array(3).keys()]" :key="boxRowIdx">
        <td v-for="boxColIdx in [...Array(3).keys()]" :key="boxColIdx" class="outerT">
          <table class="boardbox">
            <tbody>
              <tr v-for="cellRowIdx in [...Array(3).keys()]" :key="cellRowIdx">
                <td v-for="cellColIdx in [...Array(3).keys()]" :key="cellColIdx" @click="onClickCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="innerT" :class="getCellClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)">
                  <div v-if="isShowFactCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="factcell">
                    {{ getFactCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) }}
                  </div>
                  <div v-if="isShowFillCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="fillcell">
                    {{ getFillCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) }}
                  </div>
                  <table v-if="isShowCandidateCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="candtb">
                    <tbody>
                      <tr v-for="candRowIdx in [...Array(3).keys()]" :key="candRowIdx">
                        <td v-for="candColIdx in [...Array(3).keys()]" :key="candColIdx" :class="getCandClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx)">
                          {{ getCand(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";

import { CELL_TYPES } from "@/utils/enums";
import { CELL_DISPLAY_TYPES, CANDIDATE_DISPLAY_TYPES } from "@/utils/enums";
import { getCellRowCol } from "@/utils/funcs";

export default {
  name: 'MainBoard',
  // props: {
  //   msg: String
  // }
  mounted() {
    this.initBoard();
  },
  computed: {
    ...mapGetters(["getCellType", "getFactCell", "getFillCell", "getCandCell"]),
    ...mapGetters(["getCellDisplayType", "getCandidateDisplayType"]),
  },
  methods: {
    ...mapMutations(["initBoard", "setCellFocused", "setSelectedCell"]),
    getCand(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx) {
      let candidates = this.getCandCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let candidate = candRowIdx * 3 + candColIdx + 1;
      if (candidates.includes(candidate)) {
        return candidate;
      }
      return '';
    },
    isShowFactCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      return this.getCellType(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) === CELL_TYPES.FACT;
    },
    isShowFillCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      return this.getCellType(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) === CELL_TYPES.FILL;
    },
    isShowCandidateCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      return this.getCellType(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) === CELL_TYPES.CANDIDATE;
    },

    // deal with DOM class
    getCellClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let cellClass = this.getCellDisplayType(row, col);
      if (CELL_DISPLAY_TYPES.SELETED === cellClass) {
        return ["cell_selected"];
      } else if (CELL_DISPLAY_TYPES.SAME_VALUE === cellClass) {
        return ["cell_same_value"];
      } else if (CELL_DISPLAY_TYPES.RELATED_POS === cellClass) {
        return ["cell_related_pos"];
      }
      return [];
    },
    getCandClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx) {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let candidateClass = this.getCandidateDisplayType(row, col, candRowIdx * 3 + candColIdx);
      if (CANDIDATE_DISPLAY_TYPES.RELATED === candidateClass) {
        return ["candidate_related"];
      }
      return [];
    },

    // deal with events
    onClickCell(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      this.setCellFocused({ row, col });
    }

  },
  data() {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border-collapse: collapse;
  border-spacing: 0;
}

th, td {
  padding: 0;
  border: 0;
}

.mainboard {
  table-layout: fixed;
  user-select: none;
  margin: 0 auto;
}

.outerT {
  background: #fdfdfd;
}

.boardbox {
  table-layout: fixed;
  margin: 0 auto;
}

.innerT {
  font-family: verdana, arial, sans-serif;
  color: #000001;
  text-align: center;
}

.candtb {
  table-layout: fixed;
  user-select: none;
  margin: 0 auto;
}

.candtb td {
  text-align: center;
  padding: 0 0 0 0;
  color: #000001;
  font-family: verdana;
}

.factcell {
  color: #000001;
}

.fillcell {
  color: rgb(0, 141, 246);
}

.cell_selected {
  background: rgb(149, 203, 205);
}

.cell_same_value {
  background: rgb(148, 215, 171);
}

.cell_related_pos {
  background: rgb(209, 235, 236);
}

.candidate_related {
  background: rgb(143, 194, 198);
}

@media (max-width: 480px) {
  .mainboard {
    width: 90vw;
    height: 90vw;
  }

  .outerT {
    outline: 0.4vw solid #bbbbbb;
    outline-offset: -0.4vw;
    height: 30vw;
    width: 30vw;
  }

  .boardbox {
    height: 30vw;
    width: 30vw;
  }

  .innerT {
    font-size: 5.5vw;
    outline: 0.1vw solid #bbbbbb;
    outline-offset: -0.1vw;
    width: 10vw;
    height: 10vw;
  }

  .candtb {
    width: 10vw;
    height: 10vw;
  }

  .candtb td {
    font-size: 2.5vw;
    width: 3.3vw;
    height: 3.3vw;
  }
}

@media (min-width: 481px) {
  .mainboard {
    width: 408px;
    height: 408px;
  }

  .outerT {
    outline: 2px solid #bbbbbb;
    outline-offset: -2px;
    height: 136px;
    width: 136px;
  }

  .boardbox {
    height: 136px;
    width: 136px;
  }

  .innerT {
    font-size: 24px;
    outline: 1px solid #bbbbbb;
    outline-offset: -1px;
    width: 45px;
    height: 45px;
  }

  .candtb {
    width: 45px;
    height: 45px;
  }

  .candtb td {
    font-size: 12px;
    width: 15px;
    height: 15px;
  }
}

</style>
