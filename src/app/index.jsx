import React from 'react'
import { Provider } from 'react-redux'

import store from '../store'
import WatchSocketProvider from '../providers/watchSocketProvider'
import Navigation from './navigation'

export default function App() {
  return (
    <Provider store={store}>
      <WatchSocketProvider>
        <Navigation />
      </WatchSocketProvider>
    </Provider>
  )
}
