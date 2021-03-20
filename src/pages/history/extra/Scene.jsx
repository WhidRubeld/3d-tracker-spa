import React from 'react'
import { Canvas, useResource } from 'react-three-fiber'

import Grid from '../../../components/map/Grid'
import Camera from '../../../components/map/Camera'
import Light from '../../../components/map/Light'
import Terrain from './Terrain'

export default function Scene({ race, onReady }) {
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
        {race && <Terrain race={race} onReady={onReady} />}
      </Canvas>
    </>
  )
}
