import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography
} from '@material-ui/core'
import { getFlagRoleText, getFlagTypeText } from '../../services'

export default function TrackerInfo({ instance, type }) {
  console.log(type)
  return (
    <List>
      <ListItem>
        <ListItemText secondary='Уникальный ID' />
        <ListItemSecondaryAction>
          <Typography variant='subtitle2'>{instance.id}</Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText secondary='Название' />
        <ListItemSecondaryAction>
          <Typography variant='subtitle2'>
            {instance[type === 'racer' ? 'name' : 'label']}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
      {type === 'flag' && (
        <>
          <ListItem>
            <ListItemText secondary='Роль' />
            <ListItemSecondaryAction>
              <Typography variant='subtitle2'>
                {getFlagRoleText(instance.role)}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText secondary='Тип' />
            <ListItemSecondaryAction>
              <Typography variant='subtitle2'>
                {getFlagTypeText(instance.type)}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      <ListItem>
        <ListItemText secondary='Цвет трекера' />
        <ListItemSecondaryAction>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: `#${instance.tracker.data.color_hex}`
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  )
}
