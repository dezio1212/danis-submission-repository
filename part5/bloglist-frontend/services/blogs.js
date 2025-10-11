import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null
const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newBlog => {
    const request = axios.post(baseUrl, newBlog)
    return request.then(response => response.data)
}
const updateUpvotes = (id, newCount) => {
    const request = axios.patch(`${baseUrl}/${id}`, { upvotes: newCount })
    return request.then(response => response.data)
}
const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { 
    getAll, 
    create, 
    updateUpvotes, 
    remove,
    setToken 
}