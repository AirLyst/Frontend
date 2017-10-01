import axios from 'axios'

export function sell(data) {
  return dispatch => {
    console.log(data)
    const formData = new FormData()
    data.photos.forEach((photo, index) => {
      formData.append('photos', photo, `photo${index}.png`)
    })
    const textData = {
      name: data.name,
      description: JSON.stringify(data.description),
      brand: data.brand,
      condition: data.condition,
      userId: data.userId,
    }
    formData.append("data", JSON.stringify(textData))
    return axios.post('http://localhost:4000/api/listing', formData)
  }
}


// export function login(data) {
//   return dispatch => {
//     return axios.post('/api/login', data)
//     .then(res => { // Got token, else do nothing
//       const token = res.data.token
//       localStorage.setItem('jwtToken', token) // Add token to local storage
//       setAuthorizationToken(token) // Add token to header of HTTP requests
//       dispatch(setCurrentUser(jwt.decode(token))) // Send action to reducers with correct type
//     })
//   }
// }