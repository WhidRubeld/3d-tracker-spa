import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Fab } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import ManageRaceModal from '../../../components/modals/ManageRaceModal'

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

export default function CreateRaceFab({ race }) {
  const [modal, setModal] = useState(false)
  const classes = useStyles()

  const { entity } = useSelector((state) => state.details)

  return (
    <>
      <ManageRaceModal
        open={modal}
        onClose={() => setModal(false)}
        race={entity}
      />
      <Fab
        aria-label='Edit'
        className={classes.fab}
        color='primary'
        onClick={() => setModal(true)}
      >
        <EditIcon />
      </Fab>
    </>
  )
}
