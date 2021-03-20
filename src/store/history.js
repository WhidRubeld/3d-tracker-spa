import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk('history/load', async (payload) => {
  const response = await ApiService.getRace(payload)
  return response
})

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    loading: true,
    entity: null
  },
  reducers: {},
  extraReducers: {
    [load.pending]: (state) => {
      state.loading = true
    },
    [load.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.entity = payload
    }
  }
})

export default historySlice.reducer
