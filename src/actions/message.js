import axios from 'axios'

/**
 * Create a new conversation
 * @param
 * user - id of user that started the conversation
 * recipient - receiving user
 * message - the text message itself
 */
export function newConversation(data) {
  return dispatch => {
    return axios.post('/api/chat', data)
  }
}

/**
 * @param id - the user's ID 
 * Fetch all conversations started by a user,
 * return the conversations with other
 * participants and a one line snippet
 */
export function getConversations(id) {
  return dispatch => {
    return axios.get(`/api/chat/${id}`)
  }
}

/**
 * 
 * @param data - has the conversation id and the 
 * id of the user who made the request 
 */
export function getChat(data) {
  return dispatch => {
    return axios.get(`/api/chat/${data._id}/${data.conversationId}`)
  }
}


/**
 * 
 * @param data requires the conversationId, the message
 * and the sender's user ID(obtained from redux store)
 */
export function sendMessage(data) {
  return dispatch => {
    return axios.put('/api/chat', data)
  }
}