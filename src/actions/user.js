import axios from 'axios'

export function save_profile_pic(data) {
  return dispatch => {
    return axios.put(`http://localhost:4000/api/user/${data.userId}/profile_picture`, { image: data.image })
  }
}

export function getUser(userId) {
  return dispatch => {
    return axios.get(`http://localhost:4000/api/user/${userId}`)
  }
}