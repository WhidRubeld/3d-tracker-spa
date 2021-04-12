/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import RacerPoint from '../../../../components/map/RacerPoint'
import FlagPoint from '../../../../components/map/FlagPoint'

export default function Subjects({ subjects, onPress }) {
  if (subjects) {
    return (
      <>
        {subjects.racers.map((racer, index) => {
          const { tracker } = racer
          const { movement, color_hex } = tracker
          if (movement) {
            return (
              <RacerPoint
                onClick={() => onPress({ id: racer.id, type: 'racer' })}
                color={`#${color_hex}`}
                position={movement.position}
                key={index}
              />
            )
          }
          return null
        })}
        {subjects.flags.map((flag, index) => {
          const { tracker } = flag
          const { movement, color_hex } = tracker
          if (movement) {
            return (
              <FlagPoint
                onClick={() => onPress({ id: flag.id, type: 'flag' })}
                color={`#${color_hex}`}
                position={movement.position}
                key={index}
              />
            )
          }
          return null
        })}
      </>
    )
  }

  return null
}
