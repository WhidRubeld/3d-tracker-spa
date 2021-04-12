import React from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'

export default function FlagsInfo({ flags, renderAction }) {
  if (!flags.length) {
    return (
      <Box padding={3} textAlign='center'>
        <Typography color='textSecondary' variant='caption'>
          Участников не найдено
        </Typography>
      </Box>
    )
  }

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
