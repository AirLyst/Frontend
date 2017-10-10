// Modules
import React, { Component } from 'react';
import { Link, withRouter }             from 'react-router-dom';
import { connect }          from 'react-redux'
import { logout }   from '../actions/login'

// Components
import ProfileBubble from './profile/ProfileBubble.jsx'
import SignupModal from './SignupModal.jsx'
import Login from './Login.jsx'
import NavMobile from './NavMobile.jsx'

//Styles
import './styles/Navigation.css'

class Navigation extends Component {

  state = {
    fullName: '',
    signup: false,
    login: false,
    category: false,
    dropdown: false,
    hasPicture: false,
  }

  componentWillMount() {
    if (this.props.user.isAuthenticated) {
      const { firstName, lastName, profile_picture } = this.props.user.info
      if (firstName || lastName) 
        this.setState({ fullName: `${firstName} ${lastName}`})
      if (profile_picture)
        this.setState({ hasPicture: true })
    }
  }

  // componentDidUpdate() {
  //   // console.log(window.pageYOffset)
  //   document.addEventListener('scroll', () => {
  //     this.setState({ lastOffset: window.page})
  //     console.log(window.pageYOffset)
  //   })
  // }

  toggleMenu = () => {
    this.setState({ dropdown: !this.state.dropdown })
  }

  toggleSignup = () => {
    this.setState({ signup: !this.state.signup })
  }

  toggleLogin = () => {
    this.setState({ login: !this.state.login })
  }

  toggleCat = () => {
    this.setState({ category: !this.state.category})
  }

  logout = () => {
    this.setState({ dropdown: false })
    this.props.logout()
  }

  closeModal = () => {
    this.setState({
      signup: false,
      login: false,
      category: false
    })
  }

  render() {
    const notLoggedIn = (
      <span>
        <Link to='/signup'><button onClick={this.toggleSignup} className="navButton">Sign Up</button></Link>
        <Link to='/signin'><button onClick={this.toggleLogin} className="navButton">Login</button></Link>
      </span>
    )

    const loggedIn = (
      <span className="navBubble">
        {this.state.hasPicture 
          ? <Link to='/profile' style={{textDecoration: 'none'}}><img alt='User Profile' src={this.props.user.info.profile_picture}/> </Link>
          : <ProfileBubble small/>}
        <p onClick={this.toggleMenu}>{this.state.fullName} <span>&#x2335;</span></p>
        {this.state.dropdown && 
          <ul className="dropdown">
            <li><Link to="/sell" className="dropdownLink" onClick={this.toggleMenu}>Sell</Link></li>
            <li><Link to={`/profile`} className="dropdownLink" onClick={this.toggleMenu}>Profile</Link></li>
            <li><Link to="/" className="dropdownLink" onClick={this.logout}>Logout</Link></li>
          </ul>}
      </span>
    )

    return (
      <div>
        <div className="navPlaceholder"/>
        <div className="navOntop">
          <div className="navContainer">
            <div className="navContent">
              <Link to="/" id="navLogo" onClick={this.closeModal}>GEARHUB</Link>
              {this.props.user.isAuthenticated ? loggedIn : notLoggedIn}
              {/* { this.state.signup && <SignupModal toggle={this.state.signup} close={this.closeModal}/> } */}
              {/* { this.state.login && <Login toggle={this.state.login} close={this.closeModal}/> } */}
            </div>
          </div>
          <NavMobile
            catState={this.state.category}
            openModal={this.toggleCat}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, { logout })(Navigation))

/*         */
