import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export const create = async (payload) => {
  try {
    const { data } = await axios.post(baseUrl, payload)
    return data
  } catch (error) {
    throw new Error(error?.response?.data?.error || 'Request failed')
  }
}

const update  = (id, payload)  => axios.put(`${baseUrl}/${id}`, payload).then(res => res.data)

const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(res => res.data)

export default { getAll, create, update, remove }