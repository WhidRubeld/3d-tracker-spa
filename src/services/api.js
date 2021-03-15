import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const RACE_SHOW_URL = (id) => `${API_URL}/races/${id}`

export class ApiService {
  static getRace(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(RACE_SHOW_URL(id))
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }
}
