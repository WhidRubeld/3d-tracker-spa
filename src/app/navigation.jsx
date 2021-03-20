import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/home'
import History from '../pages/history'

export default function Navigation() {
  return (
    <Router>
      <Switch>
        <Route path='/:raceId/history'>
          <History />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
