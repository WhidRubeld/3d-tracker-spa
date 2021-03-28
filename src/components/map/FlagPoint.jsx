import React from 'react'

const CYLINDER_HEIGHT = 35
const CYLINDER_RADIUS = 0.75

const CONE_RADIUS = 5
const CONE_HEIGHT = 20
const CONE_RADICAL_SEGMENTS = 2
const CONE_HEIGHT_SEGMENTS = 1

function CylinderPoint(props) {
  return (
    <mesh {...props}>
      <cylinderGeometry
        args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT, 50]}
      />
      <meshStandardMaterial color='#000000' />
    </mesh>
  )
}

function ConePoint({ color, ...props }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} {...props}>
      <coneGeometry
        args={[
          CONE_RADIUS,
          CONE_HEIGHT,
          CONE_RADICAL_SEGMENTS,
          CONE_HEIGHT_SEGMENTS,
          true,
          0,
          Math.PI * 2
        ]}
      />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function RacePoint({ color = '#0000', ...props }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} {...props}>
      <CylinderPoint position={[0, CYLINDER_HEIGHT / 2, 0]} />
      <ConePoint
        color={color}
        position={[0, CYLINDER_HEIGHT - CONE_RADIUS, CONE_HEIGHT / 2]}
      />
    </group>
  )
}
