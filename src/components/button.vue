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
      <div v-for="num in [...Array(9).keys()]" :key="num" @click="onClickNumber(num + 1)" class="numberbutton">{{ num + 1 }}</div>
      <div class="numberbutton" @click="onEraseCell">Erase</div>
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
  width: 412px;
  user-select: none;
}

.controlbutton {
  height: 50px;
  width: 50px;
  background: #f3f3f3;
  line-height: 50px;
  text-align: center;
}

.numberpanel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
  width: 412px;
  height: 120px;
  column-gap: 40px;
  margin-top: 16px;
  user-select: none;
}

.numberbutton {
  height: 50px;
  width: 50px;
  background: #f3f3f3;
  line-height: 50px;
  text-align: center;
}

.noteoff {
  background: #f3f3f3;
}

.noteon {
  background: rgb(0, 141, 246);
}

</style>
