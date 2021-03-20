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

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    pagination: {},
    loading: true,
    entities: [],
    ready: false
  },
  reducers: {},
  extraReducers: {
    [next.pending]: (state, action) => {
      if (!state.loading) {
        state.loading = true
      }
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

export default listSlice.reducer
