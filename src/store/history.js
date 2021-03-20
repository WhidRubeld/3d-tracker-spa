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

const resetState = (state) => {
  state.loading = false
  state.entity = null
  state.error = null
  state.second = 0
}

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    loading: true,
    entity: null,
    error: null,
    second: 0
  },
  reducers: {
    reset: resetState,
    setSecond: (state, { payload }) => {
      const { entity } = state
      if (entity && payload && payload > 0 && payload < entity.duration) {
        state.second = payload
      }
    }
  },
  extraReducers: {
    [load.pending]: (state) => {
      resetState(state)
      state.loading = true
    },
    [load.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.entity = payload
    },
    [load.rejected]: (state, { payload: error }) => {
      resetState(state)
      state.error = error
    }
  }
})

export const { reset, setSecond } = historySlice.actions

export default historySlice.reducer
