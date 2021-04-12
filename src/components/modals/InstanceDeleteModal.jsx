import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'
import LoadingButton from '../LoadingButton'

import { ApiService } from '../../services'

import { reset as resetList } from '../../store/list'
import {
  reset as resetDetails,
  manageTracker as manageDetailsTracker
} from '../../store/details'
import { reset as resetHistory, load as loadHistory } from '../../store/history'
import {
  reset as resetWatch,
  manageTracker as manageWatchTracker
} from '../../store/watch'

const actions = {
  race: 'deleteRace',
  racer: 'deleteRacer',
  flag: 'deleteFlag'
}

export default function ManageFlagModal({
  instance,
  type,
  title,
  description,
  successMessage,
  errorMessage,
  open,
  onClose,
  onSuccess = () => {}
}) {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const { entity: detailsEntity } = useSelector((state) => state.details)
  const { entity: historyEntity } = useSelector((state) => state.history)
  const { entity: watchEntity } = useSelector((state) => state.watch)

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    setLoading(false)
    onClose()
  }

  useEffect(() => {
    if (open) setIsOpen(true)
  }, [open])

  const onSubmit = () => {
    setLoading(true)

    ApiService[actions[type]](instance.id)
      .then(() => {
        setIsOpen(false)
        onClose()
        enqueueSnackbar(successMessage, {
          variant: 'success'
        })

        onSuccess()

        if (type === 'race') {
          if (detailsEntity && detailsEntity === instance.id) {
            dispatch(resetDetails())
          }
          if (watchEntity && watchEntity === instance.id) {
            dispatch(resetWatch())
          }
          if (historyEntity && historyEntity === instance.id) {
            dispatch(resetHistory())
          }
        } else {
          const { race_id } = instance
          if (detailsEntity && detailsEntity.id === race_id) {
            dispatch(
              manageDetailsTracker({
                type,
                instance: { action: 'delete', data: instance }
              })
            )
          }
          if (watchEntity && watchEntity.id === race_id) {
            dispatch(
              manageWatchTracker({
                type,
                instance: { action: 'delete', data: instance }
              })
            )
          }
          if (historyEntity && historyEntity.id === race_id) {
            dispatch(
              loadHistory({
                raceId: race_id,
                payload: { with_movements: 1 }
              })
            )
          }
        }

        dispatch(resetList())
      })
      .catch(() => {
        enqueueSnackbar(errorMessage, {
          variant: 'error'
        })
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      disableBackdropClick={loading}
      aria-labelledby='race-modal-title'
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle id='race-modal-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' disabled={loading}>
          Отмена
        </Button>
        <LoadingButton
          type='submit'
          variant='contained'
          color='primary'
          loading={loading}
          onClick={onSubmit}
        >
          Удалить
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
