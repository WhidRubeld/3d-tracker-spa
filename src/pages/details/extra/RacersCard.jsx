/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Card, Box, Typography, IconButton } from '@material-ui/core'
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons'

import RacersInfo from '../../../components/info/RacersInfo'
import ManageRacerModal from '../../../components/modals/ManageRacerModal'

export default function RacersCard({ entity }) {
  const [racerModal, setRacerModal] = useState(false)
  const [selectedRacer, setSelectedRacer] = useState(null)

  const handleCloseRacerModal = () => {
    setRacerModal(false)
    setSelectedRacer(null)
  }

  const handleSelectRacer = (v) => {
    setSelectedRacer(v)
    setRacerModal(true)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' paddingRight={2}>
        <Typography variant='overline'>Список участников</Typography>
        <IconButton
          color='primary'
          size='small'
          onClick={() => setRacerModal(true)}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Box>
      <Card>
        <RacersInfo
          racers={entity.racers.data}
          renderAction={(racer) => (
            <IconButton
              color='primary'
              size='small'
              onClick={() => handleSelectRacer(racer)}
            >
              <EditIcon fontSize='small' />
            </IconButton>
          )}
        />
      </Card>
      <ManageRacerModal
        race={entity}
        racer={selectedRacer}
        open={racerModal}
        onClose={handleCloseRacerModal}
      />
    </>
  )
}
