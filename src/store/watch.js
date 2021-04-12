import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'
import { manageFlag, manageRacer } from './extra'

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
    loading: false,
    entity: null,
    error: null
  },
  reducers: {
    reset: resetState,
    update: (state, { payload }) => {
      state.entity = payload
    },
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
    },
    manageTracker: (state, { payload }) => {
      const { type, instance } = payload

      switch (type) {
        case 'flag':
          manageFlag(state, instance)
          break
        case 'racer':
          manageRacer(state, instance)
          break
        default:
          break
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

export const { reset, update, newPosition, manageTracker } = watchSlice.actions

export default watchSlice.reducer
