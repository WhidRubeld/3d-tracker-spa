import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))

export default function LoadingButton({ loading, disabled, ...props }) {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Button {...props} disabled={loading || disabled} />
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  )
}
