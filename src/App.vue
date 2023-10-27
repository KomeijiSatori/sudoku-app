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
</div>
</template>

<script>
import Menu from '@/components/menu.vue';
import Board from '@/components/board.vue';
import Button from '@/components/button.vue';

export default {
  name: 'App',
  components: {
    Board,
    Button,
    Menu,
  }
}
</script>

<style>
#app {
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
