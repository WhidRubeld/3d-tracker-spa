import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Chip,
  makeStyles
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import {
  ArrowBack as ArrowBackIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  History as HistoryIcon
} from '@material-ui/icons'

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  statusButton: {
    marginLeft: 'auto'
  },
  title: {
    flexGrow: 1
  }
}))

export default function Appbar({ runtime = false }) {
  const classes = useStyles()

  const { entity } = useSelector(
    (state) => state[runtime ? 'watch' : 'history']
  )

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
          <Chip
            icon={
              runtime ? (
                <SettingsInputAntennaIcon fontSize='small' />
              ) : (
                <HistoryIcon fontSize='small' />
              )
            }
            label={runtime ? 'Режим отслеживания' : 'Режим истории'}
            color='primary'
            variant='outlined'
            className={classes.statusButton}
          />
        </Toolbar>
      </AppBar>
    </div>
  )
}
