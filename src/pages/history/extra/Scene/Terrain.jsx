import React, { useState, useEffect } from 'react'
import { Map, Source } from '../../../../utils/map'

export default function Terrain({ race, onReady, ready }) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    const { location: locationObj } = race
    const { data: location } = locationObj
    const { latitude, longitude, zoom_index: zoom } = location
    setMap(
      new Map({
        source: new Source('mapbox', process.env.REACT_APP_MAPBOX_TOKEN),
        location: [latitude, longitude],
        options: { zoom },
        material: { wireframe: false }
      })
    )
  }, [])

  useEffect(() => {
    if (!ready && map && onReady) map.init(() => onReady(map))
  }, [map, ready, onReady])

  return (
    <primitive object={map ? map.terrain : () => {}} position={[0, 0, 0]} />
  )
}
