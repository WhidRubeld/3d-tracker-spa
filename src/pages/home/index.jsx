import React, { useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  IconButton,
  Badge
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import {
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  AccessibilityNew as AccessibilityNewIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  History as HistoryIcon
} from '@material-ui/icons'

import { Link as RouterLink } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { load } from '../../store/list'
import { dateForHuman, secondConvertor } from '../../heleprs'
import CreateRaceFab from './extra/createRaceFab'

export default function HomeScreen() {
  const { entities, loading, pagination, ready } = useSelector(
    (state) => state.list
  )
  const { entity: detailsEntity } = useSelector((state) => state.details)
  const { entity: watchEntity } = useSelector((state) => state.watch)
  const { entity: historyEntity } = useSelector((state) => state.history)

  const { current_page, total_pages } = pagination

  const dispatch = useDispatch()

  useEffect(() => {
    if (!ready) {
      dispatch(load())
    }
  }, [dispatch, ready])

  function ListItem({ description, value, icon: Icon }) {
    return (
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        paddingTop={0.5}
        paddingBottom={0.5}
      >
        <Box display='flex'>
          <Icon fontSize='small' />
          <Typography
            variant='caption'
            style={{ marginLeft: 5, fontWeight: 'lighter' }}
          >
            {description}
          </Typography>
        </Box>
        <Typography variant='subtitle2'>{value}</Typography>
      </Box>
    )
  }

  function RaceCard({ race }) {
    const isDetails = detailsEntity && detailsEntity.id === race.id
    const isWatch = watchEntity && watchEntity.id === race.id
    const isHistory = historyEntity && historyEntity.id === race.id

    return (
      <Card>
        <CardContent>
          <Typography
            gutterBottom
            variant='h6'
            component='h2'
            style={{ fontWeight: 'lighter' }}
          >
            {race.title}
          </Typography>
          <ListItem
            icon={EventAvailableIcon}
            description='Начало'
            value={dateForHuman(race.started_at)}
          />
          <ListItem
            icon={AccessTimeIcon}
            description='Длительность'
            value={secondConvertor(race.duration)}
          />
          <ListItem
            icon={FlagIcon}
            description='Чекпоинтов'
            value={race.flags.data.length}
          />
          <ListItem
            icon={AccessibilityNewIcon}
            description='Участников'
            value={race.racers.data.length}
          />
        </CardContent>
        <CardActions>
          <Badge
            variant={isDetails ? 'dot' : undefined}
            style={{ marginRight: 'auto' }}
            color='error'
          >
            <Button
              size='small'
              color='primary'
              component={RouterLink}
              to={`/${race.id}/details`}
            >
              Подробнее
            </Button>
          </Badge>
          <Badge variant={isWatch ? 'dot' : undefined} color='error'>
            <IconButton
              size='small'
              color='primary'
              component={RouterLink}
              to={`/${race.id}/watch`}
            >
              <SettingsInputAntennaIcon fontSize='small' />
            </IconButton>
          </Badge>
          <Badge variant={isHistory ? 'dot' : undefined} color='error'>
            <IconButton
              size='small'
              color='primary'
              component={RouterLink}
              to={`/${race.id}/history`}
            >
              <HistoryIcon fontSize='small' />
            </IconButton>
          </Badge>
        </CardActions>
      </Card>
    )
  }

  function renderRacesList() {
    return (
      <Grid container spacing={3}>
        {entities.map((race, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <RaceCard race={race} />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Container style={{ marginTop: 30 }}>
      {renderRacesList()}
      <Box
        display='flex'
        justifyContent='center'
        marginTop={5}
        marginBottom={5}
      >
        {ready && (
          <Pagination
            color='primary'
            page={current_page}
            count={total_pages}
            disabled={loading}
            onChange={(e, v) => dispatch(load(v))}
          />
        )}
      </Box>
      <CreateRaceFab />
    </Container>
  )
}
