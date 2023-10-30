<template>
  <div>
    <div class="menupanel">
      <div class="menubutton" @click="onClickNew">New</div>
      <div class="menubutton" @click="onClickLoad">Load</div>
      <div class="menubutton" @click="onResetBoard">Reset</div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";

const boardStr2Ary = (boardTxt) => {
  if (null === boardTxt || boardTxt.length !== 9 * 9) {
    return null;
  }
  let ary = [...Array(9)].map(() => Array(9).fill(null));
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let curChar = boardTxt[i * 9 + j];
      if (curChar >= '1' && curChar <= '9') {
        ary[i][j] = curChar - '0';
      }
    }
  }
  return ary;
}

export default {
  name: 'MenuPanel',

  mounted() {
    this.initPuzzle();
  },

  computed: {
    ...mapGetters(["getPuzzleStr", "getPuzzleCount"]),
  },

  methods: {
    ...mapMutations(["resetBoard", "loadBoard", "initPuzzle"]),
    onClickNew() {
      let totalCnt = this.getPuzzleCount();
      let ind = Math.floor(Math.random() * totalCnt);
      let boardStr = this.getPuzzleStr(ind);
      let ary = boardStr2Ary(boardStr)
      if (null !== ary) {
        this.loadBoard(ary);
      }
    },
    onClickLoad() {
      let boardTxt = prompt("Enter a string of 81 numbers (you can express blanks as 0, *, _ or '.')");
      let ary = boardStr2Ary(boardTxt)
      if (null === ary) {
        alert("not getting 81 numbers!")
        return;
      }
      this.loadBoard(ary);
    },
    onResetBoard() {
      this.resetBoard();
    },
  },

  data() {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menupanel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  margin: 0 auto;
}

.menubutton {
  background: #f3f3f3;
  text-align: center;
}

@media (max-width: 480px) {
  .menupanel {
    width: 90vw;
  }
  .menubutton {
    height: 14vw;
    width: 14vw;
    line-height: 14vw;
    font-size: 5vw;
  }
}

@media (min-width: 481px) {
  .menupanel {
    width: 408px;
  }
  .menubutton {
    height: 60px;
    width: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}

</style>
