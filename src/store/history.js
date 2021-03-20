import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk(
  'history/load',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ApiService.getRace(payload)
      return response
    } catch (e) {
      return rejectWithValue(e)
    }
  }
)

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    loading: true,
    entity: null,
    error: null
  },
  reducers: {
    reset: (state) => {
      state.loading = null
      state.entity = null
      state.error = null
    }
  },
  extraReducers: {
    [load.pending]: (state) => {
      state.loading = true
    },
    [load.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.entity = payload
    },
    [load.rejected]: (state, { payload: error }) => {
      state.error = error
      state.entity = null
      state.loading = false
    }
  }
})

export const { reset } = historySlice.actions

export default historySlice.reducer
