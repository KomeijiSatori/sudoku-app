<template>
<div>
  <div class="menu">
    <Menu />
  </div>
  <div class="board">
    <Board />
  </div>
  <div class="buttons">
    <Button />
  </div>
  <Hint />
</div>
</template>

<script>
import Menu from '@/components/menu.vue';
import Board from '@/components/board.vue';
import Button from '@/components/button.vue';
import Hint from '@/components/hint.vue';

export default {
  name: 'App',
  components: {
    Board,
    Button,
    Menu,
    Hint,
  }
}
</script>

<style>
body {
  margin: 0;
}

.menu {
  margin-top: 10px;
}

.board {
  margin-top: 20px;
}

.buttons {
  margin-top: 16px;
}
</style>
