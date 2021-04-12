import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Fab } from '@material-ui/core'
import { DeleteSweep as DeleteSweepIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import InstanceDeleteModal from '../../../components/modals/InstanceDeleteModal'

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(11),
    right: theme.spacing(3)
  }
}))

export default function DeleteRaceFab() {
  const history = useHistory()

  const [modal, setModal] = useState(false)
  const classes = useStyles()

  const { entity } = useSelector((state) => state.details)

  return (
    <>
      <InstanceDeleteModal
        type='race'
        instance={entity}
        title='Удаление отслеживания'
        description='Вы действительно хотите удалить данное отслеживание? Данное действие необратимо, все привязанные трекеры и их координаты будут удалены'
        successMessage='Отслеживание успешно удалено'
        errorMessage='Ошибка удаления отслеживания'
        open={modal}
        onClose={() => setModal(false)}
        onSuccess={() => history.replace('/')}
      />
      <Fab
        aria-label='Delete'
        size='small'
        className={classes.fab}
        color='secondary'
        onClick={() => setModal(true)}
      >
        <DeleteSweepIcon fontSize='small' />
      </Fab>
    </>
  )
}
