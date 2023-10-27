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
  padding: 0px;
  border: 0px;
  font-size: 10pt;
}

.mainboard {
  table-layout: fixed;
  width: 408px;
  height: 408px;
  user-select: none;
}

.outerT {
  background: #fdfdfd;
  border: 1px solid #bbbbbb;
  height: 136px;
  width: 136px;
}

.boardbox {
  table-layout: fixed;
  margin: 0 auto;
}

.innerT {
  font-family: verdana, arial, sans-serif;
  font-size: 16pt;
  color: #000001;
  border: 1px solid #888888;
  width: 44px;
  height: 44px;
  text-align: center;
}

.candtb {
  table-layout: fixed;
  margin: 0 auto;
}

.candtb td {
  text-align: center;
  padding: 0 0 0 0;
  color: #000001;
  font-size: 8pt;
  font-family: verdana;
  width: 14px;
  height: 14px;
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

</style>
