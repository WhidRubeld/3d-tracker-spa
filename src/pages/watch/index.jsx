/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { load } from '../../store/watch'

import Appbar from '../../components/Appbar'
import Backdrop from '../../components/Backdrop'

import Scene from './extra/Scene/index'

export default function WatchScreen() {
  const { raceId } = useParams()
  const [ready, setReady] = useState(false)

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.watch)

  useEffect(() => {
    if (!entity || entity.id !== raceId) {
      dispatch(load(raceId))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  return (
    <>
      <Appbar runtime={true} />
      <Scene race={entity} onReady={() => setReady(true)} ready={ready} />
      <Backdrop ready={ready} />
    </>
  )
}
