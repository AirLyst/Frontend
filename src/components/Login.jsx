import React, { Component } from 'react';
import { connect }          from 'react-redux'
import { withRouter } from 'react-router-dom';
import PropTypes            from 'prop-types'
import FacebookLogin        from 'react-facebook-login'
import GoogleLogin          from 'react-google-login'
import FontAwesome          from 'react-fontawesome'
import { login, fbLogin, gLogin } from '../actions/login'
import './styles/Signin.scss'

class Login extends Component {

  state = {
    username: '',
    password: ''
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.login(this.state)
    .then(res => {
      this.context.router.history.push('/')
    })
  }


  facebookLogin = (res) => {
    const { accessToken, email, picture } = res
    const token = { accessToken, email, picture }
    this.props.fbLogin(token, email)
    .then(res => {
      this.context.router.history.push('/')
   })
  }

  googleLogin = (res) => {
    const { id_token } = res.tokenObj
    const { email } = res.profileObj
    const token = { id_token, email }
    this.props.gLogin(token)
    .then(res => {
      this.context.router.history.push('/')
    })
  }

  googleLoginFail(err){
    console.log(err)
  }
  render() {
    return (
      <div className='signin-page'>
        <form onSubmit={this.onSubmit} type="submit">

          <h1>Login</h1>
          <div className="login">
            <input type="text"  name="username" placeholder="Username" value={this.state.username} onChange={this.onChange} />
            <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange} />
            <button type="submit" onClick={this.onSubmit}>Login</button>
          </div>
          <br />
          <span className='outsideLogin'><FacebookLogin
            appId="1149120715232337"
            callback={this.facebookLogin}
            fields="name,email"
            icon="fa-facebook-f fa-lg"
            textButton="&emsp;Login with Facebook"
            cssClass="mediaLogin facebook"
          />
          <br />
          <GoogleLogin
            clientId="806344560011-hrjb8lgp4ugu7kcqaspdmkjgkdjv2gp2.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={this.googleLogin}
            onFailure={this.googleLoginFail}
            className="mediaLogin google">
            <FontAwesome
              name="google lg"
              id="googleLogo"
              size="lg"/>
              <span>&emsp;Login with Google</span>
          </GoogleLogin></span>
        </form>
      </div>
    )
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(null, { login, fbLogin, gLogin })(Login))
