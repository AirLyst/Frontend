import axios from 'axios'

export default function setAuthorizationToken(token) {
  if(token) { // Logging in, adds header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  else { // Logging out, removed header
    delete axios.defaults.headers.common['Authorization']
  }
}
