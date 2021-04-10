import React from 'react'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function CustomBackdrop({ ready }) {
  const classes = useStyles()

  const { loading: listLoading } = useSelector((state) => state.list)
  const { loading: watchLoading } = useSelector((state) => state.watch)
  const { loading: historyLoading } = useSelector((state) => state.history)

  return (
    <Backdrop
      className={classes.backdrop}
      open={listLoading || watchLoading || historyLoading}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}
