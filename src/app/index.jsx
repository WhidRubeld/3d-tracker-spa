import React, { createRef } from 'react'
import { SnackbarProvider } from 'notistack'
import { Collapse, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { Provider } from 'react-redux'

import store from '../store'
import WatchSocketProvider from '../providers/watchSocketProvider'
import Navigation from './navigation'

export default function App() {
  const notistackRef = createRef()
  const onSnackDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key)
  }

  return (
    <SnackbarProvider
      maxSnack={3}
      TransitionComponent={Collapse}
      ref={notistackRef}
      action={(key) => (
        <IconButton color='inherit' onClick={onSnackDismiss(key)}>
          <CloseIcon />
        </IconButton>
      )}
    >
      <Provider store={store}>
        <WatchSocketProvider>
          <Navigation />
        </WatchSocketProvider>
      </Provider>
    </SnackbarProvider>
  )
}
