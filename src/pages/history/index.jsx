import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { load } from '../../store/history'

import Appbar from './extra/Appbar'
import Scene from './extra/Scene/index'
import PlaybackPanel from './extra/PlaybackPanel'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function HistoryScreen() {
  const { raceId } = useParams()
  const [map, setMap] = useState(null)
  const [ready, setReady] = useState(false)

  const classes = useStyles()

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.history)

  useEffect(() => {
    if (!entity || entity.id !== raceId) {
      dispatch(load(raceId))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  useEffect(() => {
    if (map && !ready) {
      setReady(true)
    }
  }, [map, ready])

  return (
    <>
      <Appbar />
      <Scene race={entity} onReady={setMap} ready={ready} />
      {ready && <PlaybackPanel />}
      <Backdrop className={classes.backdrop} open={!ready}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}
