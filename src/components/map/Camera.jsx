import React, { forwardRef } from 'react'
import { MapControls, PerspectiveCamera } from '@react-three/drei'

const Camera = forwardRef((props, ref) => {
  return (
    <>
      <PerspectiveCamera
        ref={ref}
        makeDefault
        position={[0, -1.25e3, 10e2]}
        fov={75}
        far={1e6}
        up={[0, 0, 1]}
      />
      <MapControls camera={ref.current} />
    </>
  )
})

export default Camera
