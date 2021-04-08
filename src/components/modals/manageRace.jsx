import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'

import moment from 'moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import { ValidatorForm } from 'react-material-ui-form-validator'
import TextFieldValidator from '../../components/form-validators/TextFieldValidator'
import KeyboardDatePickerValidator from '../../components/form-validators/KeyboardDatePickerValidator'
import KeyboardTimePickerValidator from '../../components/form-validators/KeyboardTimePickerValidator'
import LoadingButton from '../../components/LoadingButton'

import { ApiService } from '../../services'
import { convertTime } from '../../heleprs'

import { reset as resetList } from '../../store/list'
import { load as loadHistory } from '../../store/history'
import { load as loadWatch } from '../../store/watch'

const defaultValues = {
  title: null,
  description: null,
  started_at: null,
  duration: null,
  location_name: null,
  location_description: null,
  location_latitude: null,
  location_longitude: null,
  location_zoom_index: null
}

export default function ManageRaceModal({ race, open, onClose, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const { entity: historyEntity } = useSelector((state) => state.history)
  const { entity: watchEntity } = useSelector((state) => state.watch)

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(defaultValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setIsOpen(true)
      if (race) {
        const { title, description, started_at, duration } = race
        const { data: location } = race.location
        const {
          name: location_name,
          description: location_description,
          latitude: location_latitude,
          longitude: location_longitude,
          zoom_index: location_zoom_index
        } = location

        setForm({
          title,
          description,
          started_at: convertTime(started_at).format('YYYY-MM-DD HH:mm:ss'),
          duration: duration,
          location_name,
          location_description,
          location_latitude,
          location_longitude,
          location_zoom_index
        })
      } else setForm(defaultValues)
    }
  }, [open, race])

  const handleClose = () => {
    setIsOpen(false)
    setLoading(false)
    onClose()
  }

  const onSubmit = () => {
    setLoading(true)
    const payload = {
      ...form,
      started_at: moment.utc(form.started_at).format('YYYY-MM-DD HH:mm:ss')
    }

    const promise = !race
      ? ApiService.createRace(payload)
      : ApiService.updateRace(race.id, payload)

    promise
      .then((instance) => {
        setIsOpen(false)
        onClose()
        enqueueSnackbar(
          !race
            ? 'Отслеживание успешно добавлено'
            : 'Отслеживание успешно обновлено',
          {
            variant: 'success'
          }
        )

        if (race) {
          if (historyEntity && historyEntity.id === race.id) {
            dispatch(
              loadHistory({ raceId: race.id, payload: { with_movements: 1 } })
            )
          }
          if (watchEntity && watchEntity.id === race.id) {
            dispatch(loadWatch(race.id))
          }
        } else dispatch(resetList())

        onSuccess(instance)
      })
      .catch(() => {
        enqueueSnackbar(
          !race
            ? 'Ошибка добавления отслеживания'
            : 'Ошибка обновления отслеживания',
          {
            variant: 'error'
          }
        )
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
          {!race ? 'Новое отслеживание' : 'Редактирование отслеживания'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextFieldValidator
            autoFocus={!race}
            label='Название отслеживания'
            type='text'
            value={form.title}
            onChange={(event) =>
              setForm((v) => ({ ...v, title: event.target.value }))
            }
            validators={['required']}
            errorMessages={['Поле обязательно для заполнения']}
            disabled={loading}
            required
            fullWidth
          />
          <TextFieldValidator
            margin='normal'
            label='Описание отслеживания'
            type='text'
            value={form.description}
            onChange={(event) =>
              setForm((v) => ({ ...v, description: event.target.value }))
            }
            disabled={loading}
            multiline
            rows={4}
            fullWidth
          />
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <KeyboardDatePickerValidator
                  format='MM/DD/yyyy'
                  margin='normal'
                  label='Дата начала'
                  value={form.started_at}
                  onChange={(started_at) =>
                    setForm((v) => ({ ...v, started_at }))
                  }
                  minDate={new Date()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  validators={['required']}
                  errorMessages={['Поле обязательно для заполнения']}
                  disabled={loading}
                  required
                  cancelLabel='Отмена'
                  okLabel='Завершить'
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <KeyboardTimePickerValidator
                  margin='normal'
                  id='time-picker'
                  label='Время начала'
                  value={form.started_at}
                  onChange={(started_at) =>
                    setForm((v) => ({ ...v, started_at }))
                  }
                  ampm={false}
                  KeyboardButtonProps={{
                    'aria-label': 'change time'
                  }}
                  disabled={loading}
                  required
                  cancelLabel='Отмена'
                  okLabel='Завершить'
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextFieldValidator
                  margin='normal'
                  label='Длительность'
                  type='number'
                  value={form.duration}
                  onChange={(event) =>
                    setForm((v) => ({ ...v, duration: event.target.value }))
                  }
                  validators={['required', 'minNumber:60']}
                  errorMessages={[
                    'Поле обязательно для заполнения',
                    'Минимальная длительность 60 секунд'
                  ]}
                  disabled={loading}
                  required
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
          <TextFieldValidator
            margin='normal'
            label='Название локации'
            type='text'
            value={form.location_name}
            onChange={(event) =>
              setForm((v) => ({ ...v, location_name: event.target.value }))
            }
            validators={['required']}
            errorMessages={['Поле обязательно для заполнения']}
            disabled={loading}
            required
            fullWidth
          />
          <TextFieldValidator
            margin='normal'
            label='Описание локации'
            type='text'
            value={form.location_description}
            onChange={(event) =>
              setForm((v) => ({
                ...v,
                location_description: event.target.value
              }))
            }
            disabled={loading}
            multiline
            rows={4}
            fullWidth
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextFieldValidator
                margin='normal'
                label='Широта'
                type='number'
                value={form.location_latitude}
                onChange={(event) =>
                  setForm((v) => ({
                    ...v,
                    location_latitude: event.target.value
                  }))
                }
                validators={['required']}
                errorMessages={['Поле обязательно для заполнения']}
                disabled={loading}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextFieldValidator
                margin='normal'
                label='Долгота'
                type='number'
                value={form.location_longitude}
                onChange={(event) =>
                  setForm((v) => ({
                    ...v,
                    location_longitude: event.target.value
                  }))
                }
                validators={['required']}
                errorMessages={['Поле обязательно для заполнения']}
                disabled={loading}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextFieldValidator
                margin='normal'
                label='Машстаб блока'
                type='number'
                value={form.location_zoom_index}
                onChange={(event) =>
                  setForm((v) => ({
                    ...v,
                    location_zoom_index: event.target.value
                  }))
                }
                validators={['required', 'minNumber:2', 'maxNumber:15']}
                errorMessages={[
                  'Поле обязательно для заполнения',
                  'Минимальный размер 2',
                  'Максимальный размер 15'
                ]}
                disabled={loading}
                required
                fullWidth
              />
            </Grid>
          </Grid>
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
            {!race ? 'Добавить' : 'Обновить'}
          </LoadingButton>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}
