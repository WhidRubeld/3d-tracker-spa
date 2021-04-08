import moment from 'moment-timezone'

export const convertTime = (text) => moment.tz(text, 'Etc/GMT').local()

export const secondConvertor = (v) => {
  return new Date(v * 1e3).toISOString().substr(11, 8)
}
