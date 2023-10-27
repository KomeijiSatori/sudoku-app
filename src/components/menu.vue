<template>
  <div>
    <div class="menupanel">
      <div class="menubutton" @click="onClickLoad">Load</div>
      <div class="menubutton" @click="onResetBoard">Reset</div>
    </div>
  </div>
</template>

<script>

import { mapMutations } from "vuex";


export default {
  name: 'MenuPanel',

  methods: {
    ...mapMutations(["resetBoard", "loadBoard"]),
    onClickLoad() {
      let boardTxt = prompt("Enter a string of 81 numbers (you can express blanks as 0, *, _ or '.')");
      if (null === boardTxt || boardTxt.length !== 9 * 9) {
        alert("not getting 81 numbers!")
        return;
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
  width: 412px;
  user-select: none;
}

.menubutton {
  height: 50px;
  width: 50px;
  background: #f3f3f3;
  line-height: 50px;
  text-align: center;
}

</style>
