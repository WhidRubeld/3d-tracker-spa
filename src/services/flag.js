export const flagRoles = [
  {
    text: 'Не указан',
    value: null
  },
  {
    text: 'Персонал',
    value: 'staff'
  },
  {
    text: 'Судья',
    value: 'referee'
  }
]

export const getFlagRoleText = (role) => {
  const index = flagRoles.map((v) => v.value).indexOf(role)
  return flagRoles[index].text
}

export const flagTypes = [
  {
    text: 'Не указан',
    value: null
  },
  {
    text: 'Точка старта',
    value: 'start'
  },
  {
    text: 'Точка финиша',
    value: 'finish'
  },
  {
    text: 'Промежуточная точка',
    value: 'loop'
  }
]

export const getFlagTypeText = (type) => {
  const index = flagTypes.map((v) => v.value).indexOf(type)
  return flagTypes[index].text
}
