/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Chip,
  Button,
  IconButton
} from '@material-ui/core'
import {
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@material-ui/icons'

import { load } from '../../store/details'

import LocationInfo from '../../components/info/LocationInfo'
import RacersInfo from '../../components/info/RacersInfo'
import FlagsInfo from '../../components/info/FlagsInfo'

import UpdateRaceFab from './extra/updateRaceFab'
import ManageRacerModal from '../../components/modals/ManageRacerModal'
import ManageFlagModal from '../../components/modals/ManageFlagModal'

import { dateForHuman, secondConvertor } from '../../heleprs'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2)
  },
  dateChip: {
    marginRight: theme.spacing(1)
  },
  watchButton: {
    marginRight: theme.spacing(1)
  },
  grid: {
    marginTop: theme.spacing(1)
  }
}))

export default function AlignItemsList() {
  const { raceId } = useParams()

  const dispatch = useDispatch()
  const { entity, error } = useSelector((state) => state.details)
  const { entity: watchEntity } = useSelector((state) => state.watch)
  const { entity: historyEntity } = useSelector((state) => state.history)

  const isWatch = entity && watchEntity && entity.id === watchEntity.id
  const isHistory = entity && historyEntity && entity.id === historyEntity.id

  useEffect(() => {
    if (!entity || entity.id !== parseInt(raceId, 10)) {
      dispatch(load(raceId))
    }
  }, [])

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  const classes = useStyles()

  const [racerModal, setRacerModal] = useState(false)
  const [selectedRacer, setSelectedRacer] = useState(null)

  const handleCloseRacerModal = () => {
    setRacerModal(false)
    setSelectedRacer(null)
  }

  const handleSelectRacer = (v) => {
    setSelectedRacer(v)
    setRacerModal(true)
  }

  const [flagModal, setFlagModal] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState(null)

  const handleCloseFlagModal = () => {
    setFlagModal(false)
    setSelectedFlag(null)
  }

  const handleSelectFlag = (v) => {
    setSelectedFlag(v)
    setFlagModal(true)
  }

  if (!entity) return null

  return (
    <Container className={classes.root}>
      <Typography variant='h4'>{entity.title}</Typography>
      <Box display='flex' marginBottom={1} marginTop={2}>
        <Chip
          className={classes.dateChip}
          variant='outlined'
          icon={<EventAvailableIcon />}
          label={dateForHuman(entity.started_at)}
        />
        <Chip
          variant='outlined'
          icon={<AccessTimeIcon />}
          label={secondConvertor(entity.duration)}
        />
      </Box>
      <Box display='flex' marginBottom={1}>
        <Button
          className={classes.watchButton}
          variant='contained'
          color='primary'
          size='small'
          startIcon={<SettingsInputAntennaIcon />}
          component={RouterLink}
          to={`/${entity.id}/watch`}
        >
          {isWatch ? 'Продолжить' : 'Отслеживать'}
        </Button>
        <Button
          variant='contained'
          color='primary'
          size='small'
          startIcon={<HistoryIcon />}
          component={RouterLink}
          to={`/${entity.id}/history`}
        >
          {isHistory ? 'Продолжить' : 'Воспроизвести'}
        </Button>
      </Box>
      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant='overline'>Данные геолокации</Typography>
          <Card>
            <LocationInfo location={entity.location.data} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display='flex' justifyContent='space-between' paddingRight={2}>
            <Typography variant='overline'>Список участников</Typography>
            <IconButton
              color='primary'
              size='small'
              onClick={() => setRacerModal(true)}
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Box>
          <Card>
            <RacersInfo
              racers={entity.racers.data}
              renderAction={(racer) => (
                <IconButton
                  color='primary'
                  size='small'
                  onClick={() => handleSelectRacer(racer)}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              )}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display='flex' justifyContent='space-between' paddingRight={2}>
            <Typography variant='overline'>Список флагов</Typography>
            <IconButton
              color='primary'
              size='small'
              onClick={() => setFlagModal(true)}
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Box>
          <Card>
            <FlagsInfo
              flags={entity.flags.data}
              renderAction={(flag) => (
                <IconButton
                  color='primary'
                  size='small'
                  onClick={() => handleSelectFlag(flag)}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              )}
            />
          </Card>
        </Grid>
      </Grid>
      <UpdateRaceFab />
      <ManageRacerModal
        race={entity}
        racer={selectedRacer}
        open={racerModal}
        onClose={handleCloseRacerModal}
      />
      <ManageFlagModal
        race={entity}
        flag={selectedFlag}
        open={flagModal}
        onClose={handleCloseFlagModal}
      />
    </Container>
  )
}
