import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk(
  'details/load',
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

export const detailsSlice = createSlice({
  name: 'details',
  initialState: {
    loading: false,
    entity: null,
    error: null
  },
  reducers: {
    reset: resetState,
    update: (state, { payload }) => {
      state.entity = payload
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

export const { reset, update } = detailsSlice.actions

export default detailsSlice.reducer
