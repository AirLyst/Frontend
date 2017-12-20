import { combineReducers } from 'redux'
import user from './user.js'
import openChats from '../actions/chat.js'

export default combineReducers({
  user, // Only saving global state of current user
  openChats
})