<template>
  <div v-if="isShowHint()">
    <div class="mask"></div>
    <div class="inner">
      <table class="mainboard">
        <tbody>
          <tr v-for="boxRowIdx in [...Array(3).keys()]" :key="boxRowIdx">
            <td v-for="boxColIdx in [...Array(3).keys()]" :key="boxColIdx" class="outerT">
              <table class="boardbox">
                <tbody>
                  <tr v-for="cellRowIdx in [...Array(3).keys()]" :key="cellRowIdx">
                    <td v-for="cellColIdx in [...Array(3).keys()]" :key="cellColIdx" class="innerT" :class="getCellClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)">
                      <div v-if="isShowNumber(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="numbercell">
                        {{ getHintNumber(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) }}
                      </div>
                      <table v-if="isShowCandidate(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx)" class="candtb">
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
      <div class="buttonpanel">
        <div class="innerbutton" @click="onClickCalc" v-if="!clickedCalc">Calc</div>
        <div class="innerbutton" @click="onClickPrev" v-if="clickedCalc && hasPrevResult()">Prev</div>
        <div class="innerbutton" @click="onClickNext" v-if="clickedCalc && hasNextResult()">Next</div>
        <div class="innerbutton" @click="onClickClose">Close</div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from "vuex";

import { getCellRowCol } from "@/utils/funcs";

import { HINT_CELL_TYPES } from "@/utils/enums";
import { HINT_CELL_DISPLAY_TYPES, HINT_CANDIDATE_DISPLAY_TYPES } from "@/utils/enums";

export default {
  name: 'HintDialog',
  computed: {
    ...mapGetters(["isShowHint", "getHintCellType", "getHintNumber", "getHintCand"]),
    ...mapGetters(["getHintCellDisplayType", "getHintCandidateDisplayType"]),
    ...mapGetters(["hasPrevResult", "hasNextResult"]),
  },
  methods: {
    ...mapMutations(["setShowHint"]),
    ...mapActions(["calculateHints", "moveToPrevResult", "moveToNextResult"]),
    isShowNumber(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      return this.getHintCellType(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) === HINT_CELL_TYPES.NUMBER;
    },
    isShowCandidate(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      return this.getHintCellType(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) === HINT_CELL_TYPES.CANDIDATE;
    },
    getCand(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx) {
      let candidates = this.getHintCand(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let candidate = candRowIdx * 3 + candColIdx + 1;
      if (candidates.includes(candidate)) {
        return candidate;
      }
      return '';
    },
    getCellClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx) {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let cellClass = this.getHintCellDisplayType(row, col);
      if (HINT_CELL_DISPLAY_TYPES.EVIDANCE === cellClass) {
        return ["hint_cell_evidance"];
      } else if (HINT_CELL_DISPLAY_TYPES.ELIMINATION === cellClass) {
        return ["hint_cell_elimination"];
      }
      return [];
    },
    getCandClass(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx, candRowIdx, candColIdx) {
      let [row, col] = getCellRowCol(boxRowIdx, boxColIdx, cellRowIdx, cellColIdx);
      let candidateClass = this.getHintCandidateDisplayType(row, col, candRowIdx * 3 + candColIdx);
      if (HINT_CANDIDATE_DISPLAY_TYPES.EVIDANCE === candidateClass) {
        return ["hint_cand_evidance"];
      } else if (HINT_CANDIDATE_DISPLAY_TYPES.ELIMINATION === candidateClass) {
        return ["hint_cand_elimination"];
      }
      return [];
    },
    onClickCalc() {
      this.clickedCalc = true;
      this.calculateHints();
    },
    onClickPrev() {
      this.moveToPrevResult();
    },
    onClickNext() {
      this.moveToNextResult();
    },
    onClickClose() {
      this.clickedCalc = false;
      this.setShowHint(false);
    }
  },
  data() {
    return {
      clickedCalc: false,
    }
  }
}

</script>


<style>

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 0.7;
}

.inner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: white;
}

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

.buttonpanel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  margin: 0 auto;
}

.innerbutton {
  background: #f3f3f3;
  text-align: center;
}

.hint_cand_evidance {
  background: green;
}

.hint_cand_elimination {
  background: yellow;
}

@media (max-width: 480px) {
  .inner {
    width: 96vw;
    height: 108vw;
    border-radius: 3vw;
  }

  .mainboard {
    width: 90vw;
    height: 90vw;
    margin-top: 3vw;
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

  .buttonpanel {
    width: 90vw;
    margin-top: 3vw;
  }

  .innerbutton {
    width: 10vw;
    height: 10vw;
    line-height: 10vw;
    font-size: 3.6vw;
  }
}

@media (min-width: 481px) {
  .inner {
    width: 450px;
    height: 500px;
    border-radius: 20px;
  }

  .mainboard {
    width: 408px;
    height: 408px;
    margin-top: 20px;
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

  .buttonpanel {
    width: 408px;
    margin-top: 20px;
  }

  .innerbutton {
    width: 45px;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
  }
}

</style>