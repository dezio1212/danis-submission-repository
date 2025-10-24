import axios from "axios"
const baseUrl = '/api/login'

const login = async (credential) => {
    const { data } = await axios.post(baseUrl, credential)
    return data             // { token, username, name, ....... 
}


export default { login }