import { configureStore } from '@reduxjs/toolkit'
import listReducer from './list'

export default configureStore({
  reducer: {
    list: listReducer
  }
})
