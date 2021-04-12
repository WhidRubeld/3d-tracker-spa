/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Card, Box, Typography, IconButton } from '@material-ui/core'
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons'

import FlagsInfo from '../../../components/info/FlagsInfo'
import ManageFlagModal from '../../../components/modals/ManageFlagModal'

export default function FlagsCard({ entity }) {
  const [flagModal, setFlagModal] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState(null)

  const handleCloseFlagModal = () => {
    setFlagModal(false)
    setSelectedFlag(null)
  }

  const handleSelectFlag = (v) => {
    setSelectedFlag(v)
    setFlagModal(true)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' paddingRight={2}>
        <Typography variant='overline'>Список флагов</Typography>
        <IconButton
          color='primary'
          size='small'
          onClick={() => setFlagModal(true)}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Box>
      <Card>
        <FlagsInfo
          flags={entity.flags.data}
          renderAction={(flag) => (
            <IconButton
              color='primary'
              size='small'
              onClick={() => handleSelectFlag(flag)}
            >
              <EditIcon fontSize='small' />
            </IconButton>
          )}
        />
      </Card>
      <ManageFlagModal
        race={entity}
        flag={selectedFlag}
        open={flagModal}
        onClose={handleCloseFlagModal}
      />
    </>
  )
}
