import React, { useEffect, useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'
import { useParams } from 'react-router-dom'

import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ApiService } from '../../services'

import Grid from '../../components/map/Grid'
import Camera from '../../components/map/Camera'
import Light from '../../components/map/Light'
import Terrain from '../../components/map/Terrain'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function HistoryScreen() {
  const { raceId } = useParams()
  const [race, setRace] = useState(null)

  const classes = useStyles()

  useEffect(() => {
    ApiService.getRace(raceId)
      .then(setRace)
      .catch(() => {
        throw new Error('Race not found')
      })
  }, [])

  const camera = useResource()

  return (
    <>
      <Canvas
        style={{ height: '100vh', width: '100vw' }}
        onCreated={(state) => state.gl.setClearColor('#000000')}
      >
        <Grid />
        <Camera ref={camera} />
        <Light />
        {race && <Terrain race={race} />}
      </Canvas>
      <Backdrop className={classes.backdrop} open={!race}>
        <CircularProgress color='primary' />
      </Backdrop>
    </>
  )
}
