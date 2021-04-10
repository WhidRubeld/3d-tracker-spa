/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { load } from '../../store/history'

import Scene from './extra/Scene/index'
import PlaybackPanel from './extra/PlaybackPanel'

export default function HistoryScreen() {
  const { raceId } = useParams()
  const [ready, setReady] = useState(false)

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.history)

  useEffect(() => {
    if (!entity || entity.id !== parseInt(raceId, 10)) {
      dispatch(load({ raceId, payload: { with_movements: 1 } }))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  return (
    <>
      <Scene race={entity} onReady={() => setReady(true)} ready={ready} />
      {ready && <PlaybackPanel />}
    </>
  )
}
