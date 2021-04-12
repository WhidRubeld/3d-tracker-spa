import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem
} from '@material-ui/core'
import { ColorBox } from 'material-ui-color'

import { useSelector, useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'
import LoadingButton from '../LoadingButton'

import { ApiService, flagRoles, flagTypes } from '../../services'

import {
  ValidatorForm,
  SelectValidator
} from 'react-material-ui-form-validator'
import TextFieldValidator from '../form-validators/TextFieldValidator'

import { reset as resetList } from '../../store/list'
import { manageTracker as manageDetailsTracker } from '../../store/details'
import { load as loadHistory } from '../../store/history'
import { manageTracker as manageWatchTracker } from '../../store/watch'

const defaultValues = {
  label: null,
  role: null,
  type: null,
  color_hex: 'cccccc'
}

export default function ManageFlagModal({ race, flag, open, onClose }) {
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
      if (flag) {
        const { data: tracker } = flag.tracker
        setForm({
          label: flag.label,
          role: flag.role,
          type: flag.type,
          color_hex: tracker.color_hex
        })
      } else {
        setForm(defaultValues)
        setColor(null)
      }
    }
  }, [open, flag])

  const [color, setColor] = useState(null)

  const handleClose = () => {
    setIsOpen(false)
    setLoading(false)
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

    const promise = !flag
      ? ApiService.createFlag(payload)
      : ApiService.updateFlag(flag.id, payload)

    promise
      .then((data) => {
        setIsOpen(false)
        enqueueSnackbar(
          !flag ? 'Флаг успешно добавлен' : 'Флаг успешно обновлен',
          {
            variant: 'success'
          }
        )

        if (detailsEntity && detailsEntity.id === data.race_id) {
          dispatch(
            manageDetailsTracker({
              type: 'flag',
              instance: { action: flag ? 'update' : 'create', data }
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
            type: 'flag',
            instance: { action: flag ? 'update' : 'create', data }
          })
        }

        dispatch(resetList())
      })
      .catch(() => {
        enqueueSnackbar(
          !flag ? 'Ошибка добавления флага' : 'Ошибка обновления флага',
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
      onExited={onClose}
      disableBackdropClick={loading}
      aria-labelledby='race-modal-title'
    >
      <ValidatorForm onSubmit={onSubmit}>
        <DialogTitle id='race-modal-title'>
          {!flag ? 'Новый флаг' : 'Редактирование флага'}
        </DialogTitle>
        <DialogContent>
          <TextFieldValidator
            autoFocus={!flag}
            margin='normal'
            label='Название флага'
            type='text'
            value={form.label}
            onChange={(event) =>
              setForm((v) => ({ ...v, label: event.target.value }))
            }
            validators={['required']}
            errorMessages={['Поле обязательно для заполнения']}
            disabled={loading}
            required
            fullWidth
          />
          <SelectValidator
            margin='normal'
            label='Роль флага'
            value={form.role}
            onChange={(event) =>
              setForm((v) => ({ ...v, role: event.target.value }))
            }
            fullWidth
          >
            {flagRoles.map((role, index) => (
              <MenuItem key={index} value={role.value}>
                {role.text}
              </MenuItem>
            ))}
          </SelectValidator>
          <SelectValidator
            margin='normal'
            label='Тип флага'
            value={form.type}
            onChange={(event) =>
              setForm((v) => ({ ...v, type: event.target.value }))
            }
            fullWidth
          >
            {flagTypes.map((type, index) => (
              <MenuItem key={index} value={type.value}>
                {type.text}
              </MenuItem>
            ))}
          </SelectValidator>
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
            {!flag ? 'Добавить' : 'Обновить'}
          </LoadingButton>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  )
}
