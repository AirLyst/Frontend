// Modules
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { logout }   from '../actions/login'

// Components
import ProfileBubble from './profile/ProfileBubble.jsx'
// import SignupModal from './SignupModal.jsx'
// import Login from './Login.jsx'
// import NavMobile from './NavMobile.jsx'

//Styles
import './styles/Navigation.scss'

class Navigation extends Component {

  state = {
    fullName: '',
    signup: false,
    login: false,
    category: false,
    dropdown: false,
    hasPicture: false,
    dropdownStyle: "dropdown",
    navContainerStyle: 'navContainer transparent enter nav-top',
    navContentStyle: 'navContent',
    currentOffset: 0,
    logoStyle: 'navLogo logo-hide-at-top'
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)
    document.addEventListener('scroll', this.handleScroll)
  }

  // componenentDidUpdate() {
  //   this.handleScroll()
  // }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
    document.removeEventListener('scroll', this.handleScroll)
  }

  handleClickOutside = event => {
    const { dropdown } = this.state
    if (dropdown && !this.node.contains(event.target)){
      this.setState({ dropdownStyle: "dropdown leave" })
      setTimeout(() => 
        { this.setState({ dropdown: false, dropdownStyle: "dropdown" }) }
      ,500)
    }
  }

  handleScroll = event => {
    const offset = window.pageYOffset
    if(this.state.offset > offset) {
      // Scrolling Up, show
      if(offset > 10){
        // If we're not at the top
        this.setState({ navContainerStyle: 'navContainer opaque enter', logoStyle: 'navLogo'})
      }
      else{
        // We're at the top
        if(this.props.location.pathname === '/'){
          this.setState({ navContainerStyle: 'navContainer transparent enter nav-top', logoStyle: 'navLogo logo-hide-at-top'})          
        } else {
          this.setState({ navContainerStyle: 'navContainer transparent enter', logoStyle: 'navLogo'})
        }
      }
    } else {
      // Scrolling down, hide
      this.setState({ navContainerStyle: 'navContainer opaque exit'})
    }
    this.setState({ offset })    
  }

  toggleMenu = event => {
    const { dropdown } = this.state
    if(dropdown){
      this.setState({ dropdownStyle: "dropdown leave" })
      setTimeout(() => 
        { this.setState({ dropdown: false, dropdownStyle: "dropdown" }) }
      ,500)
    }
    else
      this.setState({ dropdown: true })
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
      <span className='loginContainer'>
        <Link to='/signup'><button onClick={this.toggleSignup} className="navButton">SIGNUP</button></Link>
        <Link to='/signin'><button onClick={this.toggleLogin} className="navButton">LOGIN</button></Link>
      </span>
    )

    let name = '', hasPicture = false
    if (this.props.user.isAuthenticated) {
      const { firstName, lastName, profile_picture } = this.props.user.info
      if (firstName || lastName) 
        name= `${firstName} ${lastName}`
      if (profile_picture)
        hasPicture = true
    }

    const loggedIn = (
      <span className="navBubble">
        {hasPicture
          ? <Link to='/profile' style={{textDecoration: 'none'}}><img alt='User Profile' src={this.props.user.info.profile_picture}/> </Link>
          : <ProfileBubble small/>}
        <p onClick={this.toggleMenu} ref={(ref) => { this.node = ref }}>{name} <span>&#x2335;</span></p>
        {this.state.dropdown && 
          <ul className={this.state.dropdownStyle}>
            <li><Link to="/sell" className="dropdownLink" onClick={this.toggleMenu}>Sell</Link></li>
            <li><Link to={`/profile`} className="dropdownLink" onClick={this.toggleMenu}>Profile</Link></li>
            <li><Link to={`/profile/messages`} className="dropdownLink" onClick={this.toggleMenu}>Messages</Link></li>
            <li><Link to="/" className="dropdownLink" onClick={this.logout}>Logout</Link></li>
          </ul>}
      </span>
    )
    const { pathname } = this.props.location
    const hasBanner = pathname !== '/' ? true : false
    const navContainerStyleUpdate = pathname === '/' 
      ? this.state.navContainerStyle 
      : `${this.state.navContainerStyle} no-banner`
    const logoStyleUpdated = pathname === '/'
      ? this.state.logoStyle
      : `${this.state.logoStyle} logo-show-at-top`
    return (
      <div>
        {hasBanner && <div className="navPlaceholder"/>}
        <div className="navOntop">
          <div className={navContainerStyleUpdate}>
            <div className='navContent'>
              <Link 
                to="/" 
                className={logoStyleUpdated} 
                onClick={this.closeModal}>AIRLYST
              </Link>
              {this.props.user.isAuthenticated ? loggedIn : notLoggedIn}
              {/* { this.state.signup && <SignupModal toggle={this.state.signup} close={this.closeModal}/> } */}
              {/* { this.state.login && <Login toggle={this.state.login} close={this.closeModal}/> } */}
            </div>
          </div>
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
