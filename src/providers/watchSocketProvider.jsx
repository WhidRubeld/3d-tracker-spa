/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

import { newPosition } from '../store/watch'

window.Pusher = Pusher
const options = {
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_KEY,
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  host: `${process.env.REACT_APP_API_HOST}:6001`
}
const echo = new Echo(options)

const WatchSocketContext = createContext()

export default function WatchSocketProvider(props) {
  const dispatch = useDispatch()
  const { entity } = useSelector((state) => state.watch)
  const [raceId, setRaceId] = useState(null)

  function startChannel() {
    const { id } = entity
    setRaceId(id)
    echo
      .channel(`race.${id}`)
      .listen('.new-position', (e) => {
        dispatch(newPosition(e))
      })
      .error((e) => {
        throw new Error(e)
      })
  }

  function leaveChannel() {
    echo.leaveChannel(`race.${raceId}`)
    setRaceId(null)
  }

  useEffect(() => {
    if (!entity && raceId) leaveChannel()
    else if (entity && raceId && entity.id !== raceId) {
      leaveChannel()
      startChannel()
    } else if (entity && !raceId) startChannel()
  }, [entity, raceId])

  return <WatchSocketContext.Provider {...props} />
}
