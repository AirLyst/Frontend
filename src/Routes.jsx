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
import CrashCourse from './components/CrashCourse.jsx'
import TestComponent from './components/TestComponent.jsx'
import Listings from './components/Listings.jsx'

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
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/signin" component={Login} />
              <Route path="/profile" component={Profile} />
              <Route path="/sell" component={Sell} />
              <Route path="/crashcourse" component={CrashCourse} />
              <Route path="/test" component={TestComponent} />
              <Route path="/listings/*" component={Listings} />
              <Route path="/*" render={() => <h1 style={{textAlign: 'center'}}>PAGE NOT FOUND</h1>} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
