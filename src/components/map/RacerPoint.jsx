import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'

const CYLINDER_HEIGHT = 20
const CYLINDER_RADIUS = 2
const SPHERE_RADIUS = 5

const MAX_SCALE = 5
const SCALE_DIFF = 0.03

function CylinderPoint(props) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={[CYLINDER_RADIUS, 0, CYLINDER_HEIGHT, 50]} />
      <meshStandardMaterial color='#000000' />
    </mesh>
  )
}

function SpherePoint({ color, ...props }) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[SPHERE_RADIUS, SPHERE_RADIUS * 6, 30]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function AnimatedSpherePoint({ color, ...props }) {
  const mesh = useRef()

  useFrame(() => {
    if (!!mesh.current) {
      let { x: scale } = mesh.current.scale
      let opacity = 1

      if (scale >= MAX_SCALE) mesh.current.scale.set(1, 1, 1)
      else {
        scale += SCALE_DIFF
        opacity -= scale / MAX_SCALE
        mesh.current.scale.set(scale, scale, scale)
      }

      mesh.current.material.opacity = opacity
    }
  })

  return (
    <mesh ref={mesh} {...props}>
      <sphereGeometry args={[SPHERE_RADIUS, SPHERE_RADIUS * 6, 30]} />
      <meshStandardMaterial color={color} transparent={true} />
    </mesh>
  )
}

export default function RacerPoint({ color, ...props }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} {...props}>
      <CylinderPoint position={[0, CYLINDER_HEIGHT / 2, 0]} />
      <SpherePoint
        color={color}
        position={[0, CYLINDER_HEIGHT + SPHERE_RADIUS - SPHERE_RADIUS / 4, 0]}
      />
      <AnimatedSpherePoint
        color={color}
        position={[0, CYLINDER_HEIGHT + SPHERE_RADIUS - SPHERE_RADIUS / 4, 0]}
      />
    </group>
  )
}
