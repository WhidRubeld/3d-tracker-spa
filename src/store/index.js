import { configureStore } from '@reduxjs/toolkit'
import listReducer from './list'
import detailsReducer from './details'
import historyReducer from './history'
import watchReducer from './watch'

export default configureStore({
  reducer: {
    list: listReducer,
    details: detailsReducer,
    history: historyReducer,
    watch: watchReducer
  }
})
