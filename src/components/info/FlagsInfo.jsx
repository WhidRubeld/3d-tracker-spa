import React from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'

export default function FlagsInfo({ flags, renderAction }) {
  return (
    <List>
      {flags.map((flag, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: `#${flag.tracker.data.color_hex}`
              }}
            />
          </ListItemAvatar>
          <ListItemText primary={flag.label} />
          {renderAction && (
            <ListItemSecondaryAction>
              {renderAction(flag)}
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  )
}
