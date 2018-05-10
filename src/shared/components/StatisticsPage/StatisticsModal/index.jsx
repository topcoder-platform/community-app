/**
 * Badges Modal Component.  Displays badge categories and earned badges.
 */
import React from 'react';
import PT from 'prop-types';
import { noop } from 'lodash';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';

import CloseButton from 'assets/images/profile/x-mark-gray.svg';

import Popup from './Popup';
import SubTrack from './SubTrack';

// These need to be named imports for the css-modules to work
/* eslint-disable no-unused-vars */
import badges from './badges.scss';
import modal from './modal.scss';
import styles from './styles.scss';
import nav from './nav.scss';
/* eslint-enable no-unused-vars */

const StatisticsModal = ({
 onClose,
}) => {
  const navArray = [
      {
          "name": "first2finish",
          "number": 104,
          "numberColor": "#21B2F1",
          "tag": "wins"
      },
      {
          "name": "code",
          "number": 21,
          "numberColor": "#21B2F1",
          "tag": "wins"
      },
      {
          "name": "design first2finish",
      },
      {
          "name": "ui prototype competition",
          "number": 1526,
          "numberColor": "#FCD617",
          "tag": "rating"
      },
      {
          "name": "assembly",
          "number": 1108,
          "numberColor": "#69C329",
          "tag": "rating"
      },
      {
          "name": "bug hunt"
      }
  ]

  const copilotArray = [
      {
          "name": "copilot",
          "number": '98.48%',
          "tag": "fulfillment"
      },
  ]


  return (
    <Modal onCancel={onClose} theme={modal}>
        <div id="ngdialog1" styleName={`nav.ngdialog nav.ngdialog-nav-theme`}>
            <div styleName="nav.ngdialog-overlay"></div>
            <div styleName="nav.ngdialog-content">
                <div styleName="nav.nav-top">
                    <div styleName="nav.user">
                        <div styleName="nav.avatar">
                            <img ng-src="https://topcoder-prod-media.s3.amazonaws.com/member/profile/thomaskranitsas-1504960369726.jpeg"
                            src="https://topcoder-prod-media.s3.amazonaws.com/member/profile/thomaskranitsas-1504960369726.jpeg"/>
                        </div>
                        <div styleName="nav.handle">
                            thomaskranitsas
                        </div>
                    </div>
                    <div onClick={onClose} styleName="nav.exit">
                        <img src="https://s3.amazonaws.com/app.topcoder.com/6452fb752535d4dc0a049c001612b393.svg"/>
                    </div>
                </div>

                <div styleName="nav.categoryNav">
                    <div styleName="nav.track">
                        <div styleName="nav.name">
                            <img src="https://s3.amazonaws.com/app.topcoder.com/62a39ec4ad2bf78b0dd993bca0e4d128.svg"/>
                            <span>DEVELOPMENT</span>
                        </div>
                        {
                            navArray.map((item, index)=>{
                                return(
                                    <SubTrack
                                        key={index}
                                        theme={nav}
                                        name={item.name}
                                        numberColor={item.numberColor}
                                        number={item.number}
                                        tag={item.tag}
                                    />
                                );
                            })
                        }
                    </div>
                    <div styleName="nav.track">
                        <div styleName="nav.name">
                            <img src="https://s3.amazonaws.com/app.topcoder.com/b3bbedd8f22edefc49c203e339241507.svg"/>
                            <span>COPILOT</span>
                        </div>
                        {
                            copilotArray.map((item, index)=>{
                                return(
                                    <SubTrack
                                        theme={nav}
                                        name={item.name}
                                        number={item.number}
                                        tag={item.tag}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
};

StatisticsModal.defaultProps = {
  onClose: noop,
};

StatisticsModal.propTypes = {
  onClose: PT.func,
};

export default StatisticsModal;
