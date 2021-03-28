import React, { useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'

import { useSelector } from 'react-redux'

import Grid from '../../../../components/map/Grid'
import Camera from '../../../../components/map/Camera'
import Light from '../../../../components/map/Light'

import Racers from './Racers'
import Terrain from './Terrain'

export default function Scene({ ready, onReady }) {
  const { entity, second } = useSelector((state) => state.history)
  const [map, setMap] = useState(null)
  const camera = useResource()

  function finishLoadTerrain(v) {
    setMap(v)
    onReady()
  }

  return (
    <>
      <Canvas
        style={{ height: '100vh', width: '100vw' }}
        onCreated={(state) => state.gl.setClearColor('#353535')}
      >
        <Grid />
        <Camera ref={camera} />
        <Light />
        {entity && (
          <Terrain race={entity} ready={ready} onReady={finishLoadTerrain} />
        )}
        {ready && <Racers race={entity} second={second} map={map} />}
      </Canvas>
    </>
  )
}
