/*
  This is static copy of http://topgear.tcmini.wpengine.com/learning-certification/ page
  we use it for temporary demo purpose only
  so we disable linting for this file
 */
/* eslint-disable */

import React from 'react';
import '../legacy-style.css';
import '../style.scss';

export default function About(props) {
  return (
     <main>
      <div className="about-header">
        <div className="container">
          <div className="hero-content text-left">
            <div className="row">
              <div className="col-sm-8 ">
                <h1>
                  <strong>Learning & Certification</strong>
                </h1>
                <div className="sub-heading"></div>
                <div className="description">
                  <p>Wipro&#039;s Hybrid Crowd offers you an opportunity to get involved
                    with a variety of challenging and interesting projects. It will help
                    accelerate your learning path and open up opportunities that were
                    not visible in the past.</p>
                  <p>Acceleration is only capable with an educated, informed and motivated
                    community of experts. We have provided the following guidance to
                    help you be most productive in your efforts as a member of Nokia&#039;s
                    Hybrid Crowd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-1 section section-resources section-bgLight section-bgColor ">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="col">
                <h2 className="title">Basics from Wipro</h2>
                <ul>
                  <li>
                    <h3><a href="#" target="_blank">Joining the Hybrid Crowd</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">How to sign up for work</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">How to compete for work</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">Payment & Rewards</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">Managing your Certifications</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">Managing your Badges</a></h3>
                    <p></p>
                  </li>
                  <li>
                    <h3><a href="#" target="_blank">Updating your Profile </a></h3>
                    <p></p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="col">
                <h2 className="title">Courses and Tutorials</h2>
                <ul>
                  <li>
                    <h3><a href="#" target="_blank">Wipro's Learning Platform</a></h3>
                    <p>Find the courses and tutorials required to manage your skills and
                      participation.
                      <br />
                    </p>
                  </li>
                  <li>
                    <h3><a href="https://help.topcoder.com" target="_blank">Support & Training</a></h3>
                    <p>Access and expansive training and support library </p>
                  </li>
                </ul>
                <div className="buttons"> <a href="#" className="btnButton">View All Videos</a> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="prefooter-section prefooter-section-1 section section-banner section-bgDark section-bgColor ">
        <div className="container">
          <h2 className="section-title">Are you ready for Wipro Hybrid Crowdsourcing Platform?</h2>
          <div className="short-description">
            <a name="bottom-register"></a>
          </div>
          <div className="buttons"> <a href="https://accounts.topcoder.com/member/registration" className="btnButton"
            target="_blank"> Join the Wipro Hybrid Crowdsourcing Platform</a> </div>
        </div>
      </div>
    </main>
  );
}
