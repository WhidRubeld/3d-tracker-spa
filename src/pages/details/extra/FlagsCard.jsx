/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import {
  Card,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core'
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@material-ui/icons'

import FlagsInfo from '../../../components/info/FlagsInfo'
import ManageFlagModal from '../../../components/modals/ManageFlagModal'

export default function FlagsCard({ entity }) {
  const [manageModal, setManageModal] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState(null)

  const [menu, setMenu] = useState()

  const handleCloseManageModal = () => {
    setManageModal(false)
    setSelectedFlag(null)
  }

  const handleOpenMenu = (event, flag) => {
    setMenu(event.currentTarget)
    setSelectedFlag(flag)
  }

  const handleCloseMenu = () => {
    setMenu(false)
    setSelectedFlag(null)
  }

  const onSelectMenu = (type) => {
    switch (type) {
      case 'show':
        break
      case 'edit':
        setManageModal(true)
        break
      case 'delete':
        break
      default:
        break
    }

    setMenu(false)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' paddingRight={2}>
        <Typography variant='overline'>Список флагов</Typography>
        <IconButton
          color='primary'
          size='small'
          onClick={() => setManageModal(true)}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Box>
      <Card>
        <FlagsInfo
          flags={entity.flags.data}
          renderAction={(flag) => (
            <>
              <IconButton
                aria-controls={`flag-${flag.id}-menu`}
                aria-haspopup='true'
                color='primary'
                size='small'
                onClick={(e) => handleOpenMenu(e, flag)}
              >
                <MoreVertIcon fontSize='small' />
              </IconButton>
              <Menu
                id={`flag-${flag.id}-menu`}
                anchorEl={menu}
                keepMounted
                open={
                  Boolean(menu) && selectedFlag && flag.id === selectedFlag.id
                }
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={() => onSelectMenu('show')}>
                  Просмотр
                </MenuItem>
                <MenuItem onClick={() => onSelectMenu('edit')}>
                  Редактировать
                </MenuItem>
                <MenuItem onClick={() => onSelectMenu('delete')}>
                  Удалить
                </MenuItem>
              </Menu>
            </>
          )}
        />
      </Card>
      <ManageFlagModal
        race={entity}
        flag={selectedFlag}
        open={manageModal}
        onClose={handleCloseManageModal}
      />
    </>
  )
}
