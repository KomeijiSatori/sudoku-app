<template>
  <div>
    <div class="controlpanel">
      <div class="controlbutton" @click="onClickUndo">Undo</div>
      <div class="controlbutton" @click="onClickRedo">Redo</div>
      <div class="controlbutton" @click="onToggleNote" :class="getNoteButtonClass">Note</div>
      <div class="controlbutton" @click="onAutoFillCandidates">Cand</div>
      <div class="controlbutton">Hint</div>
    </div>

    <div class="numberpanel">
      <div v-for="num in [...Array(5).keys()]" :key="num" @click="onClickNumber(num + 1)" class="numberbutton">{{ num + 1 }}</div>
    </div>
    <div class="numberpanel">
      <div v-for="num in [...Array(4).keys()]" :key="num" @click="onClickNumber(num + 6)" class="numberbutton">{{ num + 6 }}</div>
      <div class="controlbutton" @click="onEraseCell">Erase</div>
    </div>

  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";

import { getCellIdx } from "@/utils/funcs";
import { CELL_TYPES } from "@/utils/enums";

export default {
  name: 'ButtonPanel',

  computed: {
    ...mapGetters(["getSelectedCell", "getCellType"]),
    getNoteButtonClass() {
      return this.isInputValue ? "noteoff" : "noteon";
    }
  },

  methods: {
    ...mapMutations(["inputValue", "inputCandidate", "setCellFocused", "eraseCell", "autoFillCandidates", "undoBoard", "redoBoard"]),
    onToggleNote() {
      this.isInputValue = !this.isInputValue;
    },
    onClickNumber(val) {
      let selectedCell = this.getSelectedCell();
      if (null === selectedCell) {
        return;
      }
      let { row, col } = selectedCell;
      let curCellType = this.getCellType(...getCellIdx(row, col));

      if (curCellType === CELL_TYPES.FILL || curCellType === CELL_TYPES.CANDIDATE) {
        if (this.isInputValue) {
          this.inputValue({ row, col, val });
        } else {
          this.inputCandidate({ row, col, val });
        }
        this.setCellFocused({ row, col });
      }
    },
    onEraseCell() {
      let selectedCell = this.getSelectedCell();
      if (null === selectedCell) {
        return;
      }
      let { row, col } = selectedCell;
      let curCellType = this.getCellType(...getCellIdx(row, col));
      if (curCellType === CELL_TYPES.FILL || curCellType === CELL_TYPES.CANDIDATE) {
        this.eraseCell({ row, col });
      }
    },
    onAutoFillCandidates() {
      this.autoFillCandidates();
    },
    onClickUndo() {
      this.undoBoard();
      this.setCellFocused(this.getSelectedCell());
    },
    onClickRedo() {
      this.redoBoard();
      this.setCellFocused(this.getSelectedCell());
    },
  },

  data() {
    return {
      isInputValue: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controlpanel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  margin: 0 auto;
}

.controlbutton {
  background: #f3f3f3;
  text-align: center;
}

.numberpanel {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
  user-select: none;
  margin: 0 auto;
}

.numberbutton {
  background: #f3f3f3;
  text-align: center;
}

.noteoff {
  background: #f3f3f3;
}

.noteon {
  background: rgb(0, 141, 246);
}

@media (max-width: 480px) {
  .controlpanel {
    width: 90vw;
  }
  .controlbutton {
    height: 14vw;
    width: 14vw;
    line-height: 14vw;
    font-size: 5vw;
  }
  .numberpanel {
    width: 90vw;
    margin-top: 6vw;
  }
  .numberbutton {
    height: 14vw;
    width: 14vw;
    line-height: 14vw;
    font-size: 7vw;
  }
}

@media (min-width: 481px) {
  .controlpanel {
    width: 408px;
  }
  .controlbutton {
    height: 60px;
    width: 60px;
    line-height: 60px;
    font-size: 20px;
  }
  .numberpanel {
    width: 408px;
    margin-top: 27px;
  }
  .numberbutton {
    height: 60px;
    width: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}

</style>
