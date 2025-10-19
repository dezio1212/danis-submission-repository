import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null
const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}
const auth = () => 
    token ? { headers: {Authorization: token } } : {}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (newBlog) => {
    const config = token ? { headers: { Authorization: token } } : {}
    const { data } = await axios.post(baseUrl, newBlog, config)
    return data
}

const updateUpvotes = async (id, updated) => 
(await axios.put(`${baseUrl}/${id}`, updated, auth())).data

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`, auth())
    return request.then(response => response.data)
}

export default { 
    getAll, 
    create, 
    updateUpvotes, 
    remove,
    setToken 
}