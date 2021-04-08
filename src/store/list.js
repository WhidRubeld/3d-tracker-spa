import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../services'

export const next = createAsyncThunk(
  'list/next',
  async (payload, { getState }) => {
    const { list } = getState()
    const { pagination } = list
    const { current_page = 0 } = pagination

    const response = await ApiService.getRaceList(current_page + 1)
    return response
  }
)

const resetState = (state) => {
  state.pagination = {}
  state.loading = true
  state.entities = []
  state.ready = false
}

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    pagination: {},
    loading: true,
    entities: [],
    ready: false
  },
  reducers: {
    reset: resetState
  },
  extraReducers: {
    [next.pending]: (state, { payload }) => {
      state.loading = true
    },
    [next.fulfilled]: (state, { payload }) => {
      const { data, meta } = payload
      const { pagination } = meta

      state.loading = false
      state.pagination = pagination
      state.entities = [...state.entities, ...data]

      if (!state.ready) {
        state.ready = true
      }
    }
  }
})

export const { reset } = listSlice.actions

export default listSlice.reducer
