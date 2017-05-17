/*
  This is static copy of http://topgear.tcmini.wpengine.com/ page
  we use it for temporary demo purpose only
  so we disable linting for this file
 */
/* eslint-disable */

import React from 'react';
import '../style.scss';

export default function Home(props) {
  return (
    <main>
      <div className="home-header">
        <div className="container">
          <div className="hero-content text-left">
            <div className="row">
              <div className="col-sm-8 ">
                <h1>
                  <strong>Welcome to the TopGear Hybrid Crowdsourcing Platform</strong>
                </h1>
                <div className="sub-heading"></div>
                <div className="description">
                  <p>Our Hybrid Crowd provides the world with access to our own internal
                    crowd of Wipro experts and an external crowd of global experts.</p>
                  <p>This unique blend of in-house talent and expert contractors will amplify
                    our ability to match your needs with the specific expertise your
                    effort requires.</p>
                  <p>Wipro&#039;s Hybrid Crowd gives our vast ecosystem of customers and
                    partners options to access new ranges of skills that provide new
                    value services and efficiency options all over the world. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-1 section section-multi-column section-bgLight section-bgColor ">
        <div className="container">
          <h2 className="section-title">Get Involved Today!</h2>
          <div className="row">
            <div className="col colSizeCustom col-md-6 ">
              <h4 className="col-title">
                Learn
              </h4>
              <div className="col-description">
                <p>Wipro wants the smartest experts helping our customers solve their business
                  demands. To make it easier for workers to service the needs of Wipro
                  and our customers, we have developed a series of educational challenges
                  that will help you learn everything you need to know to be able to
                  complete tasks. </p>
              </div>
              <a className="col-cta btnButton" href="http://topgear.wipro.com">Start Learning Today</a>
            </div>
            <div className="col colSizeCustom col-md-6 ">
              <h4 className="col-title">
                Participate and Earn
              </h4>
              <div className="col-description">
                <p>Wipro wants the smartest experts helping our customers solve their business
                  demands. To make it easier for workers to service the needs of Wipro
                  and our customers, we have listed various tasks that are required for
                  different projects.
                  <br /> &nbsp; </p>
              </div>
              <a className="col-cta btnButton" href="/compete">Start Earning Today</a>
            </div>
          </div>
        </div>
      </div>
      <div className="section-2 section section-multi-column section-bgDark section-bgColor ">
        <div className="container">
          <div className="row">
            <div className="col colSizeCustom col-md-8 ">
              <h4 className="col-title">
                Jump into the Nokia Hybrid Crowd Conversation
              </h4>
              <div className="col-description">
                <p>Lets discuss all things Hybrid Crowd and the Topcoder Community.
                  <br /> Let us know if you have any questions about Wipro Hybrid Crowd or
                  the process to get started. </p>
              </div>
            </div>
            <div className="col colSizeCustom col-md-4 ">
              <h4 className="col-title">
                &nbsp;
              </h4>
              <a className="col-cta btnButton" href="https://apps.topcoder.com/forums/?module=ThreadList&forumID=607857">Discuss</a>
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
