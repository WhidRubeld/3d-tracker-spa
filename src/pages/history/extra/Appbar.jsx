import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  makeStyles
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon
} from '@material-ui/icons'

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  menuButton: {
    marginLeft: 'auto'
  },
  title: {
    flexGrow: 1
  }
}))

export default function ButtonAppBar() {
  const classes = useStyles()

  const { entity } = useSelector((state) => state.history)

  return (
    <div className={classes.root}>
      <AppBar position='fixed' color='inherit'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.backButton}
            aria-label='back'
            component={RouterLink}
            to='/'
          >
            <ArrowBackIcon />
          </IconButton>
          {entity && (
            <Typography variant='h6' className={classes.title}>
              {entity.title}
            </Typography>
          )}
          <IconButton
            edge='start'
            className={classes.menuButton}
            aria-label='menu'
            disabled
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}
