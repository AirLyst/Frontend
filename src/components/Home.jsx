import React      from 'react'
import { Route, NavLink }  from 'react-router-dom'

//%% fix this later, move back to Home
import './styles/Home.css'

//Component
import Trending    from './categories/Trending.jsx'
import Bottoms     from './categories/Bottoms.jsx'
import Headwear    from './categories/Headwear.jsx'
import Tops        from './categories/Tops.jsx'
import Kicks       from './categories/Kicks.jsx'
import Accessories from './categories/Accessories.jsx'
import SearchBar   from './SearchBar.jsx'

//Styles
import './styles/Home.css'

class Home extends React.Component {
  render() {
    return (
      <div>
        <div className='homeContainer'>
          <div className='homeContent'>
            <div className='homeHeader'>
              <span className='homeHeaderContent'>
                <span>  
                  <h1>Buy, Sell and Trade menswear.</h1>
                  <h2>Freedom. No restrictions on how transactions happen</h2>
                </span>
              </span>
            </div>
          </div>
          <br/>
          <SearchBar />
          <Route path="/home/trending"     component={Trending} />
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
        <Trending />
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
export default Home
