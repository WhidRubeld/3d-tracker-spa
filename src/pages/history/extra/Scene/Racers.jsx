/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import RacePoint from '../../../../components/map/RacePoint'

export default function Racers({ race, second, map }) {
  // const history = useSelector((state) => state.history)

  const [subjects, setSubjects] = useState(null)

  const startedAt = useMemo(() => moment(race.started_at), [])
  const duration = useMemo(() => race.duration, [])

  useEffect(() => {
    // RACERS
    const { data: racers } = race.racers
    const formattedRacers = []

    racers.forEach((racer) => {
      const movements = new Map()
      const { data: tracker } = racer.tracker
      const { data: points } = tracker.movements

      generatePoints(movements, points)

      formattedRacers.push({
        ...racer,
        tracker: {
          ...racer.tracker,
          movements
        }
      })
    })

    // FLAGS
    const { data: flags } = race.flags
    const formattedFlags = []

    flags.forEach((flag) => {
      const movements = new Map()
      const { data: tracker } = flag.tracker
      const { data: points } = tracker.movements

      generatePoints(movements, points)

      formattedFlags.push({
        ...flag,
        tracker: {
          ...flag.tracker,
          movements
        }
      })
    })

    setSubjects({
      racers: formattedRacers,
      flags: formattedFlags
    })
  }, [])

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
  }

  function generateSubjectForSecond(elems, arr, time) {
    elems.forEach((elem) => {
      const { tracker } = elem
      const { movements } = tracker
      const movement = getMovementBySecond(movements, time)
      arr.push({
        ...elem,
        tracker: {
          ...elem.tracker,
          movement
        }
      })
    })
  }

  const formattedSubjects = useMemo(() => {
    if (subjects) {
      const output = { racers: [], flags: [] }
      const { racers, flags } = subjects

      generateSubjectForSecond(racers, output.racers, second)
      generateSubjectForSecond(flags, output.flags, second)
      return output
    }

    return null
  }, [second])

  if (formattedSubjects) {
    return (
      <>
        {formattedSubjects.racers.map((racer, index) => {
          const { tracker } = racer
          const { movement } = tracker
          console.log(movement)
          if (movement) {
            return (
              <RacePoint
                color={`#${tracker.data.color_hex}`}
                position={movement.position}
                key={index}
              />
            )
          }
        })}
      </>
    )
  }

  return null
}
