/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { load } from '../../store/history'

import Appbar from '../../components/Appbar'

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
  const [ready, setReady] = useState(false)

  const classes = useStyles()

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.history)

  useEffect(() => {
    if (!entity || entity.id !== raceId) {
      dispatch(load({ raceId, payload: { with_movements: 1 } }))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  return (
    <>
      <Appbar runtime={false} />
      <Scene race={entity} onReady={() => setReady(true)} ready={ready} />
      {ready && <PlaybackPanel />}
      <Backdrop className={classes.backdrop} open={!ready}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}
