import { createStore } from 'vuex'
import board from '@/store/board';
import hint from '@/store/hint';
import puzzle from '@/store/puzzle';

export default createStore({
    modules: {
        board,
        hint,
        puzzle,
    },
  })

