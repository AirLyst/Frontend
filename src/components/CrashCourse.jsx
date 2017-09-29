import React, { Component } from 'react';

import './styles/CrashCourse.css'

class CrashCourse extends Component {
  render() {
    return (
      <div className="crashContainer">
        <h1>Crash Course</h1>
        <div className="crashFlex">
          <section className="crashTextblock">
            <h3>Why</h3>
            <p>Gearhub's mission is to create a community for millenials to buy and sell premium streetwear, high-fashion pieces, and the likes. People shouldn't have to lose a big margin of profit just to post their items for sale, so that means the prices will also be significantly cheaper.</p>
          </section>
          <section className="crashTextblock">
            <h3>Who we are</h3>
            <p>Gearhub's mission is to create a community for millenials to buy and sell premium streetwear, high-fashion pieces, and the likes. We are a small group of young students who are constantly looking for such a platform to buy and sell clothes without insane fees.</p>
          </section>
        </div>
      </div>
    );
  }
}

export default CrashCourse