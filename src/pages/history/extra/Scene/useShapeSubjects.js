/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState } from 'react'
import moment from 'moment'

export default function ShapeSubjectsHook(map, entity, second) {
  const [subjects, setSubjects] = useState(null)

  const startedAt = useMemo(() => !!entity && moment(entity.started_at), [
    entity
  ])
  const duration = useMemo(() => !!entity && entity.duration, [entity])

  useEffect(() => {
    if (!!map && !!entity && !subjects) {
      // RACERS
      const { data: racers } = entity.racers
      const formattedRacers = []

      racers.forEach((racer) => {
        const movements = new Map()
        const { data: tracker } = racer.tracker
        const { data: points } = tracker.movements

        generatePoints(movements, points)

        formattedRacers.push({
          ...racer,
          tracker: {
            ...tracker,
            movements
          }
        })
      })

      // FLAGS
      const { data: flags } = entity.flags
      const formattedFlags = []

      flags.forEach((flag) => {
        const movements = new Map()
        const { data: tracker } = flag.tracker
        const { data: points } = tracker.movements

        generatePoints(movements, points)

        formattedFlags.push({
          ...flag,
          tracker: {
            ...tracker,
            movements
          }
        })
      })

      setSubjects({
        racers: formattedRacers,
        flags: formattedFlags
      })
    }
  }, [map, entity, subjects])

  function generatePoints(movements, points) {
    points.forEach((point) => {
      const { latitude, longitude, altitude, generated_at } = point
      const position = map.getProjection([latitude, longitude, altitude])

      if (position) {
        const generatedAt = moment(generated_at)
        const diff = generatedAt.diff(startedAt) / 1e3
        if (diff <= 0) {
          movements.set(0, { ...point, position })
        } else if (diff <= duration) {
          movements.set(diff, { ...point, position })
        }
      }
    })
  }

  function getMovementBySecond(movements, time) {
    if (movements.has(time)) return movements.get(time)
    for (let i = time; i >= 0; i--) {
      if (movements.has(i)) return movements.get(i)
    }
    return null
  }

  function generateSubjectForSecond(elems, arr, time) {
    elems.forEach((elem) => {
      const { tracker } = elem
      const { movements } = tracker
      const movement = getMovementBySecond(movements, time)

      if (movement) {
        arr.push({
          ...elem,
          tracker: {
            ...tracker,
            movement
          }
        })
      }
    })
  }

  const formattedSubjects = useMemo(() => {
    if (subjects) {
      const output = { racers: [], flags: [] }
      const { racers, flags } = subjects
      console.log(output)

      generateSubjectForSecond(racers, output.racers, second)
      generateSubjectForSecond(flags, output.flags, second)
      return output
    }

    return null
  }, [second, subjects])

  return formattedSubjects
}
