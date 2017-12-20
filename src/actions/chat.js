const ADD_CHAT = 'chats/ADD_CHAT'
const CLOSE_CHAT = 'chats/CLOSE_CHAT'
const GET_CHATS = 'chats/GET_CHATS'


export function getOpenF() {
    let openChats = {}
    if(localStorage['openChats'] !== undefined) openChats = JSON.parse(localStorage['openChats'])
    return openChats
  }

  export function closeChatF(id) {
    let openChats = {}
    if(localStorage['openChats'] !== undefined) openChats = JSON.parse(localStorage['openChats'])
    delete openChats[id]
    localStorage.setItem('openChats', JSON.stringify(openChats))
    return openChats
  }

  export function addChatF(id) {
    let openChats = {}
    if(localStorage['openChats'] !== undefined) openChats = JSON.parse(localStorage['openChats'])
    if (!openChats[id]) openChats[id] = true
    localStorage.setItem('openChats', JSON.stringify(openChats))
    return openChats
  }

  const initialState = {
    openChats : {}
  }

  export default function reducer(state = initialState, action = {}) {
    const { type, payload } = action;
    let openChats = getOpenF()
    // console.log('alex', openChats)
    switch( type ) {
      case ADD_CHAT:
        openChats = addChatF( payload.openChats )
        // console.log(openChats, payload.openChats)
        return Object.assign({}, state.openChats, openChats)
      case CLOSE_CHAT:
        openChats = closeChatF( payload.openChats )
        // console.log(openChats, payload.openChats)
        return Object.assign({}, state.openChats, openChats)
      case GET_CHATS:
        return Object.assign({}, state.openChats, openChats);
      default:
        return state
    }
  }

  export const addChat = openChats => ({ type: ADD_CHAT, payload: { openChats } });
  export const getOpen = () => ({ type: GET_CHATS, func: getOpenF(), payload: {} });
  export const closeChat = openChats => ({ type: CLOSE_CHAT, payload: { openChats } });