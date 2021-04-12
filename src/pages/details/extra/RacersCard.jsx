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

import RacersInfo from '../../../components/info/RacersInfo'
import TrackerShowModal from '../../../components/modals/TrackerShowModal'
import ManageRacerModal from '../../../components/modals/ManageRacerModal'
import InstanceDeleteModal from '../../../components/modals/InstanceDeleteModal'

export default function RacersCard({ entity }) {
  const [showModal, setShowModal] = useState(false)
  const [manageModal, setManageModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRacer, setSelectedRacer] = useState(null)

  const [menu, setMenu] = useState()

  const handleCloseShowModal = () => {
    setShowModal(false)
    setSelectedRacer(null)
  }

  const handleCloseManageModal = () => {
    setManageModal(false)
    setSelectedRacer(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModal(false)
    setSelectedRacer(null)
  }

  const handleOpenMenu = (event, racer) => {
    setMenu(event.currentTarget)
    setSelectedRacer(racer)
  }

  const handleCloseMenu = () => {
    setMenu(false)
    setSelectedRacer(null)
  }

  const onSelectMenu = (type) => {
    switch (type) {
      case 'show':
        setShowModal(true)
        break
      case 'edit':
        setManageModal(true)
        break
      case 'delete':
        setDeleteModal(true)
        break
      default:
        break
    }

    setMenu(false)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' paddingRight={2}>
        <Typography variant='overline'>Список участников</Typography>
        <IconButton
          color='primary'
          size='small'
          onClick={() => setManageModal(true)}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Box>
      <Card>
        <RacersInfo
          racers={entity.racers.data}
          renderAction={(racer) => (
            <>
              <IconButton
                aria-controls={`racer-${racer.id}-menu`}
                aria-haspopup='true'
                color='primary'
                size='small'
                onClick={(e) => handleOpenMenu(e, racer)}
              >
                <MoreVertIcon fontSize='small' />
              </IconButton>
              <Menu
                id={`racer-${racer.id}-menu`}
                anchorEl={menu}
                keepMounted
                open={
                  Boolean(menu) &&
                  selectedRacer &&
                  racer.id === selectedRacer.id
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
      <TrackerShowModal
        instance={selectedRacer}
        type='racer'
        open={showModal}
        onClose={handleCloseShowModal}
      />
      <ManageRacerModal
        race={entity}
        racer={selectedRacer}
        open={manageModal}
        onClose={handleCloseManageModal}
      />
      <InstanceDeleteModal
        type='racer'
        instance={selectedRacer}
        title='Удаление участника'
        description='Вы действительно хотите удалить данного участника? Данное действие необратимо, все существующие координаты трекера будут удалены'
        successMessage='Участник успешно удален'
        errorMessage='Ошибка удаления участника'
        open={deleteModal}
        onClose={handleCloseDeleteModal}
      />
    </>
  )
}
