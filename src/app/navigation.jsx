import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Appbar from '../components/Appbar'
import Backdrop from '../components/Backdrop'

import Home from '../pages/home'
import Details from '../pages/details'
import History from '../pages/history'
import Watch from '../pages/watch'

export default function Navigation() {
  return (
    <Router>
      <Appbar />
      <Switch>
        <Route path='/:raceId/history'>
          <History />
        </Route>
        <Route path='/:raceId/watch'>
          <Watch />
        </Route>
        <Route path='/:raceId'>
          <Details />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
      <Backdrop />
    </Router>
  )
}
