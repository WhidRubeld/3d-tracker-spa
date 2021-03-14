import React from 'react'

export default function Light() {
  return (
    <>
      <ambientLight color='#404040' intensity={2.5} />
      <directionalLight
        castShadow={true}
        color='#ffffff'
        intensity={0.75}
        position={[10e3, 10e3, 10e3]}
      />
    </>
  )
}
