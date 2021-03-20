import { configureStore } from '@reduxjs/toolkit'
import listReducer from './list'
import historyReducer from './history'

export default configureStore({
  reducer: {
    list: listReducer,
    history: historyReducer
  }
})
