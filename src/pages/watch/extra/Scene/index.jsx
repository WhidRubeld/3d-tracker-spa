import React, { useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'

import { useSelector } from 'react-redux'

import Grid from '../../../../components/map/Grid'
import Camera from '../../../../components/map/Camera'
import Light from '../../../../components/map/Light'
import Terrain from '../../../../components/map/Terrain'

import Subjects from './Subjects'
import useShapeSubjects from './useShapeSubjects'

export default function Scene({ ready, onReady }) {
  const { entity } = useSelector((state) => state.watch)
  const [map, setMap] = useState(null)
  const camera = useResource()

  const subjects = useShapeSubjects(map, entity)

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
        <Subjects subjects={subjects} />
      </Canvas>
    </>
  )
}
