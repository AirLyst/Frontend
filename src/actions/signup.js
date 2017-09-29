import axios from 'axios'
import setAuthorizationToken from '../api/setAuth'
import jwt from 'jsonwebtoken'
import { setCurrentUser } from './login.js'

export function signup(userData) {
  return dispatch => {
    return axios.post('http://localhost:4000/api/signup', userData) // Tries to add to DB
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}

export function signupFacebook(userData) {
  return dispatch => {
    return axios.post('http://localhost:4000/api/signup/facebook', userData)
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}

export function signupGoogle(userData) {
  return dispatch => {
    return axios.post('http://localhost:4000/api/signup/google', userData)
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}