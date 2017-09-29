import axios from 'axios'
import setAuthorizationToken from '../api/setAuth'
import jwt from 'jsonwebtoken'
import { SET_CURRENT_USER } from './types'

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
} // Data to be dispatched to reducers, holds type

export function login(data) {
  return dispatch => {
    return axios.post('/api/login', data)
    .then(res => { // Got token, else do nothing
      const token = res.data.token
      localStorage.setItem('jwtToken', token) // Add token to local storage
      setAuthorizationToken(token) // Add token to header of HTTP requests
      dispatch(setCurrentUser(jwt.decode(token))) // Send action to reducers with correct type
    })
  }
}

export function fbLogin(data) {
  return dispatch => {
    return axios.post('/api/login/facebook', data)
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}

export function gLogin(data) {
  return dispatch => {
    return axios.post('/api/login/google', data)
    .then(res => {
      const token = res.data.token
      localStorage.setItem('jwtToken', token)
      setAuthorizationToken(token)
      dispatch(setCurrentUser(jwt.decode(token)))
    })
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken')
    setAuthorizationToken(false)
    dispatch(setCurrentUser({}))
  }
}
