import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'

export default function LocationInfo({ location }) {
  return (
    <List>
      <ListItem>
        <ListItemText primary={location.name} secondary='Название' />
      </ListItem>
      <ListItem>
        <ListItemText primary={location.latitude} secondary='Широта' />
      </ListItem>
      <ListItem>
        <ListItemText primary={location.longitude} secondary='Долгота' />
      </ListItem>
      <ListItem>
        <ListItemText primary={location.zoom_index} secondary='Масштаб блока' />
      </ListItem>
    </List>
  )
}
