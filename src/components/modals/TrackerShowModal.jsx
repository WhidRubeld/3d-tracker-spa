import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from '@material-ui/core'

import TrackerInfo from '../info/TrackerInfo'

export default function TrackerShowModal({ instance, type, open, onClose }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (open) setIsOpen(true)
  }, [open])

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onExited={onClose}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>
        {type === 'racer' ? 'Просмотр участника' : 'Просмотр флага'}
      </DialogTitle>
      <DialogContent>
        {instance && <TrackerInfo instance={instance} type={type} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)} color='primary'>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  )
}
