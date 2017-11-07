import axios from 'axios'

export function listItem(data) {
  return dispatch => {
    console.log(data.photoDescriptions)
    const formData = new FormData()
    data.photos.forEach((photo, index) => {
      formData.append('photos', photo, `photo${index}.png`)
    })
    formData.append('name', data.name)
    formData.append('photoDescriptions', JSON.stringify(data.photoDescriptions))
    formData.append('description', data.description)
    formData.append('brand', data.brand)
    formData.append('condition', data.condition)
    formData.append('userId', data.userId)
    formData.append('size', data.size)
    formData.append('category', data.category)
    formData.append('price', data.price)
    return axios.post('http://localhost:4000/api/listing', formData)
  }
}

export function getListingById(listingId) {
  return dispatch => {
    return axios.get(`http://localhost:4000/api/listing/${listingId}`)
  }
}

/**
 * Fetches all listings made by a user
 * @param userId, pivot
 */
export function getUserListings(userId, pivot) {
  return dispatch => {
    return axios.get(`/api/listing/user/${userId}/${pivot}`)
  }
}

/**
 * Likes a listing or removes like made by user
 * @param {data: { listingId: x, userId: y }} 
 */
export function likeListing(data) {
  return dispatch => {
    return axios.post('/api/listing/like', data)
  }
}