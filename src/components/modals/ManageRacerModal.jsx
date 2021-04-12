import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { ColorBox } from 'material-ui-color'

import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'
import LoadingButton from '../LoadingButton'

import { ApiService } from '../../services'

import { ValidatorForm } from 'react-material-ui-form-validator'
import TextFieldValidator from '../form-validators/TextFieldValidator'

import { reset as resetList } from '../../store/list'
import { manageTracker as manageDetailsTracker } from '../../store/details'
import { load as loadHistory } from '../../store/history'
import { manageTracker as manageWatchTracker } from '../../store/watch'

const defaultValues = {
  name: null,
  color_hex: 'cccccc'
}

export default function ManageRacerModal({ race, racer, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const { entity: detailsEntity } = useSelector((state) => state.details)
  const { entity: historyEntity } = useSelector((state) => state.history)
  const { entity: watchEntity } = useSelector((state) => state.watch)

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(defaultValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
      if (racer) {
        const { data: tracker } = racer.tracker
        setForm({
          name: racer.name,
          color_hex: tracker.color_hex
        })
      } else {
        setForm(defaultValues)
        setColor(null)
      }
    }
  }, [open, racer])

  const [color, setColor] = useState(null)

  const handleClose = () => {
    setIsOpen(false)
    setLoading(false)
    onClose()
  }

  const handleChangeColor = (value) => {
    setColor(value)
    setForm((v) => ({ ...v, color_hex: value.hex }))
  }

  const onSubmit = () => {
    setLoading(true)
    const payload = {
      race_id: race.id,
      ...form
    }

    const promise = !racer
      ? ApiService.createRacer(payload)
      : ApiService.updateRacer(racer.id, payload)

    promise
      .then((data) => {
        setIsOpen(false)
        onClose()
        enqueueSnackbar(
          !racer ? 'Участник успешно добавлен' : 'Участник успешно обновлен',
          {
            variant: 'success'
          }
        )

        if (detailsEntity && detailsEntity.id === data.race_id) {
          dispatch(
            manageDetailsTracker({
              type: 'racer',
              instance: { action: racer ? 'update' : 'create', data }
            })
          )
        }

        if (historyEntity && historyEntity.id === data.race_id) {
          dispatch(
            loadHistory({
              raceId: data.race_id,
              payload: { with_movements: 1 }
            })
          )
        }

        if (watchEntity && watchEntity.id === data.race_id) {
          manageWatchTracker({
            type: 'racer',
            instance: { action: racer ? 'update' : 'create', data }
          })
        }

        dispatch(resetList())
      })
      .catch(() => {
        enqueueSnackbar(
          !racer
            ? 'Ошибка добавления участника'
            : 'Ошибка обновления участника',
          {
            variant: 'error'
          }
        )
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
    >
      <ValidatorForm onSubmit={onSubmit}>
        <DialogTitle id='race-modal-title'>
          {!racer ? 'Новый участник' : 'Редактирование участника'}
        </DialogTitle>
        <DialogContent>
          <TextFieldValidator
            autoFocus={!racer}
            margin='normal'
            label='Название участника'
            type='text'
            value={form.name}
            onChange={(event) =>
              setForm((v) => ({ ...v, name: event.target.value }))
            }
            validators={['required']}
            errorMessages={['Поле обязательно для заполнения']}
            disabled={loading}
            required
            fullWidth
          />
          <div>
            <ColorBox
              defaultValue={`#${form.color_hex}`}
              value={color}
              onChange={handleChangeColor}
            />
          </div>
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
          >
            {!racer ? 'Добавить' : 'Обновить'}
          </LoadingButton>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}
