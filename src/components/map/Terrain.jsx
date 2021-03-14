import React, { useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import { Map, Source } from '../../utils/map'

const position = { lat: 27.988056, lng: 86.925278, alt: 8840 }

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = React.useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function Terrain() {
  const [map, setMap] = useState(null)
  const [boxCoords, setBoxCoords] = useState(null)

  useEffect(() => {
    const { lat, lng, alt } = position

    const source = new Source('mapbox', process.env.REACT_APP_MAPBOX_TOKEN)
    const instance = new Map(source, [lat, lng], {})
    setMap(instance)

    setTimeout(() => {
      const coords = instance.getProjection([lat, lng, alt])
      setBoxCoords(coords)
    }, 2e3)
  }, [])

  return (
    <>
      <primitive object={map ? map.terrain : () => {}} position={[0, 0, 0]} />
      {boxCoords && <Box position={boxCoords} />}
    </>
  )
}
