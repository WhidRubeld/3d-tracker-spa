import React, { useState, useEffect } from 'react'
import { Map, Source } from '../../utils/map'

const position = [27.988056, 86.925278]

export default function Terrain() {
  const [map, setMap] = useState(null)

  useEffect(() => {
    const source = new Source('mapbox', process.env.REACT_APP_MAPBOX_TOKEN)
    const instance = new Map(source, position, {})
    setMap(instance)
  }, [])

  return (
    <primitive object={map ? map.terrain : () => {}} position={[0, 0, 0]} />
  )
}
