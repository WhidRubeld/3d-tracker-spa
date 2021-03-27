import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/home'
import History from '../pages/history'
import Watch from '../pages/watch'

export default function Navigation() {
  return (
    <Router>
      <Switch>
        <Route path='/:raceId/history'>
          <History />
        </Route>
        <Route path='/:raceId/watch'>
          <Watch />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
