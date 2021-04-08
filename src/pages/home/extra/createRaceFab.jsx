import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import ManageRaceModal from '../../../components/modals/manageRace'

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

export default function CreateRaceFab() {
  const [modal, setModal] = useState(false)
  const classes = useStyles()

  return (
    <>
      <ManageRaceModal
        open={modal}
        onClose={() => setModal(false)}
        onSuccess={(v) => {}}
      />
      <Fab
        aria-label='Add'
        className={classes.fab}
        color='primary'
        onClick={() => setModal(true)}
      >
        <AddIcon />
      </Fab>
    </>
  )
}
