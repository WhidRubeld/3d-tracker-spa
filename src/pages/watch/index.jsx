import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

window.Pusher = Pusher

const options = {
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_KEY,
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  host: `${process.env.REACT_APP_API_HOST}:6001`
}

const echo = new Echo(options)

export default function WatchSceen() {
  const { raceId } = useParams()

  useEffect(() => {
    if (raceId) {
      echo
        .channel(`race.${raceId}`)
        .listen('.new-position', (e) => {
          console.log(e)
        })
        .subscribed(() => {
          console.log('Websockets: Subscribe ready')
        })
        .error((e) => {
          throw new Error(e)
        })

      return () => {
        echo.leaveChannel(`race.${raceId}`)
      }
    }
  }, [raceId])

  return <h1>hello</h1>
}
