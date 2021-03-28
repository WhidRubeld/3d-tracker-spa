/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import RacePoint from '../../../../components/map/RacePoint'

export default function Racers({ subjects }) {
  if (subjects) {
    return (
      <>
        {subjects.racers.map((racer, index) => {
          const { tracker } = racer
          const { movement } = tracker
          if (movement) {
            return (
              <RacePoint
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
