import React, { useMemo } from 'react'
import RacePoint from '../../../../components/map/RacePoint'

export default function Racers({ race, second }) {
  // const history = useSelector((state) => state.history)

  console.log(race, second)
  const racers = useMemo(() => race.racers.data, [race])

  return <mesh />
}
