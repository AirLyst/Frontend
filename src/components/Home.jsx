import React      from 'react'
import { Route, NavLink, Link }  from 'react-router-dom'
import { connect } from 'react-redux'
import mapStateToProps from "../utils/redux.js"
import Ionicon from 'react-ionicons'
import FontAwesome from 'react-fontawesome'
//%% fix this later, move back to Home

//Component
import Recents    from './home/Recents.jsx'
import Bottoms     from './categories/Bottoms.jsx'
import Headwear    from './categories/Headwear.jsx'
import Tops        from './categories/Tops.jsx'
import Kicks       from './categories/Kicks.jsx'
import Accessories from './categories/Accessories.jsx'
import SearchBar   from './SearchBar.jsx'
import moment from 'moment'

import busSVG from '../images/bus_stop.svg'
import profileSVG from '../images/profile.svg'
//Styles
import './styles/Home.scss'

class Home extends React.Component {

  componentWillMount() {
    this.getGreetingTime()
  }

getGreetingTime () {
  const m = moment()
	let greeting = 'Welcome back'
	
	if(!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
	
	const split_afternoon = 12 //24hr time to split the afternoon
	const split_evening = 17 //24hr time to split the evening
	const currentHour = parseFloat(m.format("HH"));
	
	if(currentHour >= split_afternoon && currentHour <= split_evening) {
		greeting = "Good afternoon";
	} else if(currentHour >= split_evening) {
		greeting = "Good evening";
	} else {
		greeting = "Good morning";
  }
	
	this.setState({ greeting })
}

  render() {
    return (
      <div>
        <div className='homeContainer'>
          <div className='homeContent'>
            <div className='homeHeader'>
            {
              this.props.user.isAuthenticated 
              ?
                <span className='homeHeaderContent'>
                  <span>  
                    <h1>{this.state.greeting} {this.props.user.info.firstName}!</h1>
                    <div className='homeHeaderAuthenticated'>
                      <Link to='/profile' className='homeHeaderLink'><span>My Profile</span></Link>
                      <Link to='/profile/messages' className='homeHeaderLink'><span>Messages</span></Link>
                    </div>
                  </span>
                </span>
              :
                <span className='homeHeaderContent'>
                  <span>  
                    <h1>Buy, Sell and Trade menswear.</h1>
                    <h2>Freedom. No restrictions on how transactions happen</h2>
                  </span>
                </span>
            }

            </div>
          </div>
          <br/>
          { !this.props.user.isAuthenticated &&
            <span>
              <span className='svgContainer'>
                <span className='svgTextContainer'>
                  <h1>Freedom.</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>
                </span>
                <img src={busSVG} alt='bus stop illustration from undraw.co'/>
              </span>
              <span className='svgContainer'>
                <img src={profileSVG} alt='profile illustration from undraw.co' className='profileSVG'/>
                <span className='svgTextContainer'>
                  <h1>Join the Community.</h1>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>
                  <span className='svgContainerButton'>
                    <Link to='/signup'><button>Sign Up  <FontAwesome name='child' color='black'/> </button></Link>
                  </span>
                </span>
              </span>
            </span>
          }
          <Recents query='recents' />
          <span className='shopCategoryContainer'>
            <span className='shopCategoryImage'>
              <span className='shopCategoryImageText'>
                <h1>Shop By</h1>
                <h1>&emsp;Category</h1>
              </span>
            </span>
            <span className='shopCategoryLinks'>
            </span>
          </span>
          <div style={{width: '80%', maxWidth: '1200px', margin: 'auto'}}>
            <h1>Browse by Categories</h1>
          </div>
          <Route path="/home/recents"     component={Recents} />
          <Route path="/home/tops"         component={Tops} />
          <Route path="/home/bottoms"      component={Bottoms} />
          <Route path="/home/kicks"        component={Kicks} />
          <Route path="/home/accessories"  component={Accessories} />
          <Route path="/home/headwear"     component={Headwear} />
          </div>
            <div className="catContainer">
              <span className="catContent">
              {categories.map((category, key) => {
                return (
                  <NavLink
                    key={key}
                    to={`/home/${category.toLowerCase()}`}
                    className="catLinks"
                    activeClassName="catLinks active"
                    >
                    {category}
                  </NavLink>
                )
              }
              )}
              </span>
          </div>
          <SearchBar />
          <div style={{height: '1000px'}}/>
      </div>
    )
  }
}

// Trending doesn't have the same attribute as these categories,
// that's why we render it outside of the map function
const categories = [
  "Trending",
  "Tops", 
  "Bottoms", 
  "Kicks", 
  "Accessories", 
  "Headwear"]
export default connect(mapStateToProps, {})(Home)
