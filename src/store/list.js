import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const load = createAsyncThunk('list/load', async (payload) => {
  const response = await ApiService.getRaceList(payload || 1)
  return response
})

const resetState = (state) => {
  state.pagination = {}
  state.loading = false
  state.entities = []
  state.ready = false
}

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    pagination: {},
    loading: false,
    entities: [],
    ready: false
  },
  reducers: {
    reset: resetState
  },
  extraReducers: {
    [load.pending]: (state) => {
      state.loading = true
    },
    [load.fulfilled]: (state, { payload }) => {
      const { data, meta } = payload
      const { pagination } = meta

      state.loading = false
      state.pagination = pagination
      state.entities = data

      if (!state.ready) {
        state.ready = true
      }
    }
  }
})

export const { reset } = listSlice.actions

export default listSlice.reducer
