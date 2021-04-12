import React, { useState, useMemo } from 'react'
import { Canvas, useResource } from 'react-three-fiber'

import { useSelector } from 'react-redux'

import Grid from '../../../../components/map/Grid'
import Camera from '../../../../components/map/Camera'
import Light from '../../../../components/map/Light'
import Terrain from '../../../../components/map/Terrain'

import Subjects from './Subjects'
import useShapeSubjects from './useShapeSubjects'

import TrackerShowModal from '../../../../components/modals/TrackerShowModal'

export default function Scene({ ready, onReady }) {
  const { entity, second } = useSelector((state) => state.history)
  const [map, setMap] = useState(null)
  const camera = useResource()

  const subjects = useShapeSubjects(map, entity, second)

  const [showSubject, setShowSubject] = useState(null)

  const instance = useMemo(() => {
    if (showSubject) {
      const { id, type } = showSubject
      return entity[`${type}s`].data.find((el) => el.id === id)
    }
    return null
  }, [entity, showSubject])

  function finishLoadTerrain(v) {
    setMap(v)
    onReady()
  }

  return (
    <>
      <Canvas
        className='scene-view'
        onCreated={(state) => state.gl.setClearColor('#353535')}
      >
        <Grid />
        <Camera ref={camera} />
        <Light />
        {entity && (
          <Terrain race={entity} ready={ready} onReady={finishLoadTerrain} />
        )}
        <Subjects subjects={subjects} onPress={setShowSubject} />
      </Canvas>
      <TrackerShowModal
        instance={instance}
        type={showSubject && showSubject.type}
        open={!!instance}
        onClose={() => setShowSubject(null)}
      />
    </>
  )
}
