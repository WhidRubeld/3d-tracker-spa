import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  Typography
} from '@material-ui/core'
import { getFlagRoleText, getFlagTypeText } from '../../services'
import { dateForHuman } from '../../heleprs'

export default function TrackerInfo({ instance, type, tracking }) {
  const tracker = instance.tracker.data || instance.tracker

  const renderFlagProps = () => {
    return type === 'flag' ? (
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
    ) : null
  }

  const renderMovement = () => {
    if (!tracking) return null

    const { movement } = tracker
    if (!movement) return null

    const data = movement.data || movement

    return (
      <>
        <ListSubheader color='primary'>Текущая позиция</ListSubheader>
        <ListItem>
          <ListItemText secondary='Широта' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>{data.latitude}</Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText secondary='Долгота' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>{data.longitude}</Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText secondary='Высота' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>{data.altitude} м</Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText secondary='Поворот' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>
              {data.bearing ? `${data.bearing}°` : '-'}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText secondary='Скорость' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>
              {data.speed ? `${data.speed} м/с` : '-'}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText secondary='Дата генерации' />
          <ListItemSecondaryAction>
            <Typography variant='subtitle2'>
              {dateForHuman(data.generated_at)}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      </>
    )
  }

  console.log(instance)

  return (
    <List>
      <ListItem>
        <ListItemText secondary='ID объекта' />
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
      {renderFlagProps()}
      <ListItem>
        <ListItemText secondary='ID трекера' />
        <ListItemSecondaryAction>
          <Typography variant='subtitle2'>
            {tracker.data ? tracker.data.id : tracker.id}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText secondary='Цвет трекера' />
        <ListItemSecondaryAction>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: `#${
                tracker.data ? tracker.data.color_hex : tracker.color_hex
              }`
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {renderMovement()}
    </List>
  )
}
