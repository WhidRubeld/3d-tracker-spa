/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Card, Typography } from '@material-ui/core'

import LocationInfo from '../../../components/info/LocationInfo'

export default function LocationCard({ entity }) {
  return (
    <>
      <Typography variant='overline'>Данные геолокации</Typography>
      <Card>
        <LocationInfo location={entity.location.data} />
      </Card>
    </>
  )
}
