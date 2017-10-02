import axios from 'axios'

export function sell(data) {
  return dispatch => {
    const formData = new FormData()
    data.photos.forEach((photo, index) => {
      formData.append('photos', photo, `photo${index}.png`)
    })
    const textData = {
      name: data.name,
      photoDescription: JSON.stringify(data.photoDescription),
      description: data.description,
      brand: data.brand,
      condition: data.condition,
      userId: data.userId,
      size: data.size,
      category: data.category,
      price: data.price
    }
    formData.append("data", JSON.stringify(textData))
    return axios.post('http://localhost:4000/api/listing', formData)
  }
}