import { configureStore } from '@reduxjs/toolkit'
import listReducer from './list'
import historyReducer from './history'
import watchReducer from './watch'

export default configureStore({
  reducer: {
    list: listReducer,
    history: historyReducer,
    watch: watchReducer
  }
})
