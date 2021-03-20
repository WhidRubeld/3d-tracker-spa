import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ApiService } from '../../services'
import Scene from './extra/Scene'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function HistoryScreen() {
  const { raceId } = useParams()
  const [race, setRace] = useState(null)
  const [map, setMap] = useState(null)
  const [ready, setReady] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    ApiService.getRace(raceId)
      .then(setRace)
      .catch(() => {
        throw new Error('Race not found')
      })
  }, [])

  useEffect(() => {
    if (map && !ready) {
      setReady(true)
    }
  }, [map, ready])

  return (
    <>
      <Scene race={race} onReady={setMap} />
      <Backdrop className={classes.backdrop} open={!ready}>
        <CircularProgress color='primary' />
      </Backdrop>
    </>
  )
}
