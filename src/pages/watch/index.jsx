/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { load } from '../../store/watch'

import Scene from './extra/Scene/index'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function WatchScreen() {
  const { raceId } = useParams()
  const [ready, setReady] = useState(false)

  const classes = useStyles()

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.watch)

  useEffect(() => {
    if (!entity || entity.id !== raceId) {
      dispatch(load(raceId))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  return (
    <>
      <Scene race={entity} onReady={() => setReady(true)} ready={ready} />
      <Backdrop className={classes.backdrop} open={!ready}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}
