import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk(
  'watch/load',
  async (raceId, { rejectWithValue }) => {
    try {
      const response = await ApiService.getRace(raceId)
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
}

export const watchSlice = createSlice({
  name: 'watch',
  initialState: {
    loading: true,
    entity: null,
    error: null
  },
  reducers: {
    reset: resetState,
    newPosition: (state, { payload }) => {
      if (!!state.entity && payload) {
        const { id, type, movement } = payload

        const index = state.entity[`${type}s`].data
          .map((item) => item.id)
          .indexOf(id)

        if (index !== -1) {
          state.entity[`${type}s`].data[index].tracker.data.movement = movement
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

export const { reset, newPosition } = watchSlice.actions

export default watchSlice.reducer
