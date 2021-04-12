export const manageRacer = (state, instance) => {
  const { entity } = state
  const { action, data } = instance

  if (!entity) return
  const { racers } = entity
  const { id } = data

  let index

  switch (action) {
    case 'create':
      state.entity.racers.data.push(data)
      break
    case 'update':
      index = racers.data.map((racer) => racer.id).indexOf(id)
      if (index !== -1) state.entity.racers.data[index] = data
      break
    case 'delete':
      index = racers.data.map((racer) => racer.id).indexOf(id)
      if (index !== -1) state.enttiy.racers.data.splice(index, 1)
      break
    default:
      break
  }
}

export const manageFlag = (state, instance) => {
  const { entity } = state
  const { action, data } = instance

  if (!entity) return
  const { flags } = entity
  const { id } = data

  let index

  switch (action) {
    case 'create':
      state.entity.flags.data.push(data)
      break
    case 'update':
      index = flags.data.map((flag) => flag.id).indexOf(id)
      if (index !== -1) state.entity.flags.data[index] = data
      break
    case 'delete':
      index = flags.data.map((flag) => flag.id).indexOf(id)
      if (index !== -1) state.enttiy.flags.data.splice(index, 1)
      break
    default:
      break
  }
}
