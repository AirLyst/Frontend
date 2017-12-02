// Modules
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import jwt from 'jsonwebtoken'

// User functions
import { setCurrentUser } from './actions/login.js'
import setAuthorizationToken from './api/setAuth'

// Redux
import rootReducer from './reducers/rootReducer'
import { Provider } from 'react-redux'

// Components
import Navigation from './components/Navigation.jsx'
import Home from './components/Home.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import Sell from './components/Sell.jsx'
import ListingSearch from './components/ListingSearch.jsx'
import CrashCourse from './components/CrashCourse.jsx'
import TestComponent from './components/TestComponent.jsx'
import Listing from './components/Listing.jsx'
import UserProfile from './components/UserProfile.jsx'
import Chat from './components/profile/Chat.jsx'
import ChatBottom from './components/ChatBottom.jsx'

// Styles

const store = createStore( // Make global store
  rootReducer,
  compose(
    applyMiddleware(thunk), // Apply promise middleware
    window.devToolsExtension ? window.devToolsExtension() : f => f // Allow chrome extension
  )
)

if(localStorage.jwtToken){
  setAuthorizationToken(localStorage.jwtToken)
  store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)))
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navigation />
            <ChatBottom />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/signin" component={Login} />
              <Route path="/profile" component={Profile} />
              <Route path="/messages/*" component={Chat} />
              <Route path="/sell" component={Sell} />
              <Route path="/crashcourse" component={CrashCourse} />
              <Route path="/test" component={TestComponent} />
              <Route path="/listing/*" component={Listing} />
              <Route path="/user/*" component={UserProfile} />
              <Route path="/search/*" component={ListingSearch} />
              <Route path="/*" render={() => <h1 style={{textAlign: 'center'}}>PAGE NOT FOUND</h1>} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
