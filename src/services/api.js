import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const RACE_BASE_URL = `${API_URL}/admin/races`
const RACE_MODEL_URL = (id) => `${API_URL}/admin/races/${id}`
const RACER_BASE_URL = `${API_URL}/admin/racers`
const RACER_MODEL_URL = (id) => `${API_URL}/admin/racers/${id}`
const FLAG_BASE_URL = `${API_URL}/admin/flags`
const FLAG_MODEL_URL = (id) => `${API_URL}/admin/flags/${id}`
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

  static deleteRace(id) {
    return new Promise((resolve, reject) => {
      axios.delete(RACE_MODEL_URL(id)).then(resolve).catch(reject)
    })
  }

  static createRacer(form) {
    return new Promise((resolve, reject) => {
      axios
        .post(RACER_BASE_URL, form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static updateRacer(id, form) {
    return new Promise((resolve, reject) => {
      axios
        .put(RACER_MODEL_URL(id), form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static deleteRacer(id) {
    return new Promise((resolve, reject) => {
      axios.delete(RACER_MODEL_URL(id)).then(resolve).catch(reject)
    })
  }

  static createFlag(form) {
    return new Promise((resolve, reject) => {
      axios
        .post(FLAG_BASE_URL, form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static updateFlag(id, form) {
    return new Promise((resolve, reject) => {
      axios
        .put(FLAG_MODEL_URL(id), form)
        .then((res) => resolve(res.data.data))
        .catch(reject)
    })
  }

  static deleteFlag(id) {
    return new Promise((resolve, reject) => {
      axios.delete(FLAG_MODEL_URL(id)).then(resolve).catch(reject)
    })
  }
}
