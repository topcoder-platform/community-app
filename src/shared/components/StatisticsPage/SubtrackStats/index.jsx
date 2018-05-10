/**
 * Skill Component.  Displays an icon and label dynamically based on data.
 */
import React from 'react';
import PT from 'prop-types';
import { truncate } from 'lodash';

import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;

const SubtrackStats = (props) => (
      <div styleName="slide">
          <tc-transclude>
              <div styleName="carousel-elem">
                  <a styleName="flex-wrapper">
                      <p styleName="value">{props.value}</p>
                      <p styleName="label">{props.label}</p>
                  </a>
              </div>
          </tc-transclude>
      </div>
);

export default SubtrackStats;
