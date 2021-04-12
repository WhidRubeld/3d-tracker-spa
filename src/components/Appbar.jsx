import React, { useMemo } from 'react'
import { AppBar, Toolbar, Typography, Box, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import GitHubButton from 'react-github-btn'

const useStyles = makeStyles((theme) => {
  console.log(theme)
  return {
    root: {
      flexGrow: 1
    },
    backButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }
})

export default function Appbar() {
  const route = useLocation()
  const currentPage = useMemo(() => {
    const { pathname } = route
    if (pathname === '/') return 'home'
    const ext = route.pathname.split('/').pop()
    return ext
  }, [route])

  const getTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Список геолокаций'
      case 'details':
        return 'Детали геолокации'
      case 'watch':
        return 'Онлайн трансляция'
      case 'history':
        return 'Воспроизведение'
      default:
        return 'Страница не найдена'
    }
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position='static' color='inherit'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            {getTitle()}
          </Typography>
          <Box display='flex' marginLeft='auto'>
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
        </Toolbar>
      </AppBar>
    </div>
  )
}
