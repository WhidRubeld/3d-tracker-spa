/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react'
import {
  makeStyles,
  Box,
  Card,
  CardContent,
  Slider,
  Typography,
  Fab
} from '@material-ui/core'
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon
} from '@material-ui/icons'

import { useSelector, useDispatch } from 'react-redux'

import { setSecond, increaseSecond } from '../../../store/history'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  card: {
    maxWidth: 360,
    width: '100%'
  },
  cardContent: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: `${theme.spacing(1.5)}px !important`,
    // padding: `${theme.spacing(2)}px !important`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  timeBox: {
    width: '100%'
  },
  fabBox: {
    position: 'absolute',
    zIndex: 1,
    top: -12,
    left: 0,
    right: 0
  },
  playFab: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}))

const playbackSpeed = [1, 2, 3]
const skipValue = 30

const secondConvertor = (v) => {
  return new Date(v * 1e3).toISOString().substr(11, 8)
}

export default function PlaybackPanel() {
  const classes = useStyles()

  const dispatch = useDispatch()

  const { entity, second } = useSelector((state) => state.history)
  const { duration } = entity
  const isStart = second === 0
  const isEnd = second === duration

  const [currentSecond, setCurrentSecond] = useState(second)
  const [isPlaying, setIsPlaying] = useState(false)

  const [speed] = useState(playbackSpeed[0])
  const timerRef = useRef()

  useEffect(() => {
    if (second) setCurrentSecond(second)
  }, [second])

  useEffect(() => {
    if (isEnd && isPlaying) {
      togglePlayback()
    }
  }, [isEnd, isPlaying])

  function togglePlayback() {
    if (isPlaying) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsPlaying(false)
    } else {
      if (isEnd) changeComplete(1)
      timerRef.current = setInterval(() => {
        dispatch(increaseSecond(speed))
      }, 1e3)
      setIsPlaying(true)
    }
  }

  function changeComplete(v) {
    dispatch(setSecond(v))
  }

  function rewind() {
    if (!isStart) dispatch(setSecond(second - skipValue))
  }

  function forward() {
    if (!isEnd) dispatch(setSecond(second + skipValue))
  }

  return (
    <Box className={classes.root}>
      <Card className={classes.card}>
        <Box
          className={classes.fabBox}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Fab
            color='primary'
            aria-label='add'
            size='small'
            onClick={() => rewind()}
          >
            <FastRewindIcon />
          </Fab>
          <Fab
            className={classes.playFab}
            color='primary'
            aria-label='play-pause'
            onClick={() => togglePlayback()}
          >
            {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
          </Fab>
          <Fab
            color='primary'
            aria-label='add'
            size='small'
            onClick={() => forward()}
          >
            <FastForwardIcon />
          </Fab>
        </Box>
        <CardContent className={classes.cardContent}>
          <Slider
            min={0}
            step={1}
            max={duration}
            value={currentSecond}
            onChange={(e, v) => setCurrentSecond(v)}
            onChangeCommitted={(e, v) => changeComplete(v)}
            disabled={isPlaying}
          />
          <Box
            className={classes.timeBox}
            display='flex'
            justifyContent='space-between'
          >
            <Typography variant='caption'>
              {secondConvertor(currentSecond)}
            </Typography>
            <Typography variant='caption'>
              {secondConvertor(duration)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
