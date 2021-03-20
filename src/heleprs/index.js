import moment from 'moment-timezone'
moment.locale('ru')

export const convertTime = (text) => moment.tz(text, 'Etc/GMT').local()
