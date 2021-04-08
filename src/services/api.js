import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const RACE_BASE_URL = `${API_URL}/admin/races`
const RACE_MODEL_URL = (id) => `${API_URL}/admin/races/${id}`

export class ApiService {
  static createRace(form) {
    return new Promise((resolve, reject) => {
      axios
        .post(RACE_BASE_URL, form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static getRaceList(page) {
    return new Promise((resolve, reject) => {
      axios
        .get(RACE_BASE_URL, { params: { page } })
        .then((res) => resolve(res.data))
        .catch(reject)
    })
  }

  static getRace(id, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(RACE_MODEL_URL(id), { params })
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static updateRace(id, form) {
    return new Promise((resolve, reject) => {
      axios
        .put(RACE_MODEL_URL(id), form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }
}
