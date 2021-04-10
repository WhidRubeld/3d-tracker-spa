import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk(
  'history/load',
  async ({ raceId, payload }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getRace(raceId, payload)
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
    loading: false,
    entity: null,
    error: null,
    second: 0
  },
  reducers: {
    reset: resetState,
    increaseSecond: (state, { payload }) => {
      if (
        !!state.entity &&
        payload &&
        payload > 0 &&
        state.second < state.entity.duration
      ) {
        if (state.second + payload <= state.entity.duration) {
          state.second += payload
        } else {
          state.second = state.entity.duration
        }
      }
    },
    setSecond: (state, { payload }) => {
      if (!!state.entity && payload !== null) {
        if (payload <= 0) {
          state.second = 0
        } else if (payload > state.entity.duration) {
          state.second = state.entity.duration
        } else {
          state.second = payload
        }
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

export const { reset, increaseSecond, setSecond } = historySlice.actions

export default historySlice.reducer
