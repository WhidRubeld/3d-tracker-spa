import React, { useEffect, useMemo } from 'react'
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Button
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'

import { next } from '../../store/list'
import { convertTime } from '../../heleprs'

const dateForHuman = (text) => convertTime(text).format('DD MMMM в HH:mm')

export default function HomeScreen() {
  const { entities, loading, pagination, ready } = useSelector(
    (state) => state.list
  )

  const { current_page, total } = pagination

  const isLastPage = useMemo(() => {
    const { total_pages, current_page } = pagination

    if (!!total_pages && !!current_page) {
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

  function renderPager() {
    if (loading) {
      return (
        <Box padding={2} textAlign='center'>
          <CircularProgress size={30} />
        </Box>
      )
    }

    if (!isLastPage) {
      return (
        <Box padding={2} textAlign='center'>
          <Button color='primary' onP>
            Загрузить еще
          </Button>
        </Box>
      )
    }

    return null
  }

  return <Container></Container>
}
