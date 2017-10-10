import axios from 'axios'

export function save_profile_pic(data) {
  return dispatch => {
    return axios.put(`http://localhost:4000/api/user/${data.userId}/profile_picture`, { image: data.image })
  }
}