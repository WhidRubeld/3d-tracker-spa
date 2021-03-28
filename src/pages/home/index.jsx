import React, { useEffect, useMemo } from 'react'
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  Button
} from '@material-ui/core'
import {
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  AccessibilityNew as AccessibilityNewIcon,
  SettingsInputAntenna as SettingsInputAntennaIcon,
  History as HistoryIcon
} from '@material-ui/icons'

import { Link as RouterLink } from 'react-router-dom'
import GitHubButton from 'react-github-btn'

import { useSelector, useDispatch } from 'react-redux'

import { next } from '../../store/list'
import { convertTime, secondConvertor } from '../../heleprs'

const dateForHuman = (text) => convertTime(text).format('DD.MM.YY в HH:mm')

export default function HomeScreen() {
  const { entities, loading, pagination, ready } = useSelector(
    (state) => state.list
  )
  const { entity: watchEntity } = useSelector((state) => state.watch)
  const { entity: historyEntity } = useSelector((state) => state.history)

  const { current_page, total } = pagination

  const isLastPage = useMemo(() => {
    const { total_pages, current_page } = pagination

    if (total_pages && current_page) {
      return current_page === total_pages
    }

    return false
  }, [pagination])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!ready) {
      dispatch(next())
    }
  }, [dispatch, loading, ready])

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
          <Button
            size='small'
            color='primary'
            startIcon={<SettingsInputAntennaIcon />}
            component={RouterLink}
            to={`/${race.id}/watch`}
          >
            {!isWatch ? 'Следить' : 'Продолжить'}
          </Button>
          <Button
            size='small'
            color='primary'
            startIcon={<HistoryIcon />}
            component={RouterLink}
            to={`/${race.id}/history`}
          >
            {!isHistory ? 'Воспроизвести' : 'Продолжить'}
          </Button>
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

  function renderPager() {
    if (loading) {
      return <CircularProgress size={20} style={{ marginTop: 15 }} />
    }

    if (!isLastPage) {
      return (
        <Button
          color='primary'
          variant='contained'
          size='small'
          style={{ marginTop: 10 }}
          onClick={() => dispatch(next())}
        >
          Загрузить еще
        </Button>
      )
    }

    return null
  }

  return (
    <Container>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        padding={5}
      >
        <Typography variant='h2'>3D Tracker</Typography>
        <Typography variant='overline' gutterBottom>
          By Vasilev Gennady
        </Typography>
        <Box display='flex'>
          <GitHubButton
            href='https://github.com/WhidRubeld/3d-tracker-api/subscription'
            data-color-scheme='no-preference: dark; light: light; dark: dark;'
            data-size='large'
            data-show-count='true'
            aria-label='Watch WhidRubeld/3d-tracker-api on GitHub'
          >
            API
          </GitHubButton>
          <div style={{ margin: '0 5px' }} />
          <GitHubButton
            href='https://github.com/WhidRubeld/3d-tracker-spa/subscription'
            data-color-scheme='no-preference: dark; light: light; dark: dark;'
            data-size='large'
            data-show-count='true'
            aria-label='Watch WhidRubeld/3d-tracker-spa on GitHub'
          >
            SPA
          </GitHubButton>
        </Box>
      </Box>
      {renderRacesList()}
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        marginTop={5}
        marginBottom={5}
      >
        {current_page && (
          <Typography variant='caption' display='block'>
            Страница {current_page} из {total}
          </Typography>
        )}
        {renderPager()}
      </Box>
    </Container>
  )
}
