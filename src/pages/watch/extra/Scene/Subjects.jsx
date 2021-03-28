/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import RacerPoint from '../../../../components/map/RacerPoint'
import FlagPoint from '../../../../components/map/FlagPoint'

export default function Subjects({ subjects }) {
  if (subjects) {
    return (
      <>
        {subjects.racers.map((racer, index) => {
          const { tracker } = racer
          const { position, color_hex } = tracker
          return (
            <RacerPoint
              color={`#${color_hex}`}
              position={position}
              key={index}
            />
          )
        })}
        {subjects.flags.map((flag, index) => {
          const { tracker } = flag
          const { position, color_hex } = tracker
          return (
            <FlagPoint
              color={`#${color_hex}`}
              position={position}
              key={index}
            />
          )
        })}
      </>
    )
  }

  return null
}
