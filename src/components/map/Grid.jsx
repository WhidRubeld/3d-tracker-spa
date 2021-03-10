import React from 'react'
import GridHelper from '../../utils/grid-helper'

export default function Grid() {
  return <primitive object={new GridHelper(50, 300)} position={[0, 0, 0]} />
}
