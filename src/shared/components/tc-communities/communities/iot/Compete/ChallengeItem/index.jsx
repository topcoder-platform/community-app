/**
 * Compete static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';

import styles from './styles.scss';

const ChallengeItem = (props) => (
  <div styleName="challenge">
    <div styleName="challenge-item">
      <div styleName="challenge-info-row">
        <div styleName="challenge-info">
          <div styleName="challenge-title">
            {props.challenge.title}
          </div>
          <p styleName="develop-challenge">{props.challenge.challenge}</p>
          <p>
            Technologies:
            {
              props.challenge.technologies.map((item, index)=>{
                return (
                  <strong key={index}> {item}</strong>
                )
              })
            }
          </p>
          <p>
            Platforms:
            {
              props.challenge.platforms.map((item, index)=>{
                return (
                  <strong key={index}> {item}</strong>
                )
              })
            }
          </p>
        </div>
      </div>

      <div styleName="challenge-submissions-row">
        <div styleName="challenge-submissions">
          <p>
            Ends: {props.challenge.phaseEnds}
          </p>
        </div>
      </div>

      <div styleName="challenge-links">
        <a styleName="links-registrants">{props.challenge.registrants}</a>
        <a styleName="links-submissions">{props.challenge.submissions}</a>
        <a styleName="links-forum">{props.challenge.forum}</a>
      </div>
    </div>
  </div>
);

export default ChallengeItem;
