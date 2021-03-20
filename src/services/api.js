import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const RACE_LIST_URL = `${API_URL}/admin/races`
const RACE_SHOW_URL = (id) => `${API_URL}/races/${id}`

export class ApiService {
  static getRaceList(page) {
    return new Promise((resolve, reject) => {
      axios
        .get(RACE_LIST_URL, { params: { page } })
        .then((res) => resolve(res.data))
        .catch(reject)
    })
  }

  static getRace(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(RACE_SHOW_URL(id))
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }
}
