import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res => res.data)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(res => res.data)
}

const update  = (id, payload)  => axios.put(`${baseUrl}/${id}`, payload).then(res => res.data)

const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(res => res.data)

export default { getAll, create, update, remove }