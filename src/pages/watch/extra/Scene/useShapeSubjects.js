/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'

export default function ShapeSubjectsHook(map, entity) {
  const subjects = useMemo(() => {
    if (map && entity) {
      const output = { racers: [], flags: [] }
      const { racers, flags } = entity

      generateSubjects(racers, output.racers)
      generateSubjects(flags, output.flags)

      return output
    }

    return null
  }, [map, entity])

  function generateSubjects(elems, arr) {
    if (elems) {
      const { data } = elems
      data.forEach((el) => {
        const { data: tracker } = el.tracker
        const { movement } = tracker

        if (movement) {
          const { latitude, longitude, altitude } = movement.data
          const position = map.getProjection([latitude, longitude, altitude])
          if (position) {
            arr.push({
              ...el,
              tracker: {
                ...tracker,
                position
              }
            })
          }
        }
      })
    }
  }

  return subjects
}
