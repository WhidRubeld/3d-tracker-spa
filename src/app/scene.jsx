import React, { useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'

import Grid from '../components/map/Grid'
import Camera from '../components/map/Camera'
import Light from '../components/map/Light'
import Terrain from '../components/map/Terrain'

export default function Scene() {
  const camera = useResource()

  const [clickEvent, setClickEvent] = useState(null)

  return (
    <Canvas
      style={{ height: '100vh', width: '100vw' }}
      onCreated={(state) => state.gl.setClearColor('#000000')}
      onDoubleClick={setClickEvent}
    >
      <Grid />
      <Camera ref={camera} />
      <Light />
      <Terrain camera={camera} lastClick={clickEvent} />
    </Canvas>
  )
}
