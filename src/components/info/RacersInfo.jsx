import React from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'

export default function RacersInfo({ racers, renderAction }) {
  return (
    <List>
      {racers.map((racer, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: `#${racer.tracker.data.color_hex}`
              }}
            />
          </ListItemAvatar>
          <ListItemText primary={racer.name} />
          {renderAction && (
            <ListItemSecondaryAction>
              {renderAction(racer)}
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  )
}
