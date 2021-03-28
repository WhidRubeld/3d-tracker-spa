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
          const { movement } = tracker
          if (movement) {
            return (
              <RacerPoint
                color={`#${tracker.color_hex}`}
                position={movement.position}
                key={index}
              />
            )
          }
          return null
        })}
        {subjects.flags.map((flag, index) => {
          const { tracker } = flag
          const { movement } = tracker
          if (movement) {
            return (
              <FlagPoint
                color={`#${tracker.color_hex}`}
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