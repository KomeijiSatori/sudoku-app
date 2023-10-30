import { createStore } from 'vuex'
import board from '@/store/board';
import puzzle from '@/store/puzzle';

export default createStore({
    modules: {
        board,
        puzzle,
    },
  })

