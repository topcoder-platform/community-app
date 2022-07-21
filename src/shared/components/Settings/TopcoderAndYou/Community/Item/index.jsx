/**
 * Render item of community
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function Item({
  checked,
  id,
  onToggle,
  title,
  description,
  link,
  value,
  icon,
}) {
  return (
    <div styleName="item-container">
      <div styleName="body">
        <img src={icon} alt="community icon" styleName="icon" />
        <div styleName="info">
          <div styleName="info-first-line">
            { title }
          </div>
          <div styleName="info-second-line">
            { description }
          </div>
          <a href={link} styleName="learn-more-btn"><span>LEARN MORE</span></a>
        </div>
        <div styleName="mobile-view">
          <div styleName="mobile-first-line">
            <img src={icon} alt={id} styleName="mobile-icon" />
            <div styleName="mobile-title">
              { title }
            </div>
            <div className="onoffswitch-mobile" styleName="onoffswitch-no-padding-right">
              <input
                type="checkbox"
                name="eprf-onoffswitch"
                id={`pre-onoffswitch-${id}`}
                value={value}
                checked={checked}
                onChange={onToggle}
                className="onoffswitch-checkbox"
              />
              <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
                <span className="onoffswitch-inner" />
                <span className="onoffswitch-switch" />
                <input type="hidden" />
              </label>
            </div>
          </div>
          <div styleName="mobile-second-line">
            { description }
          </div>
          <a href={link} styleName="learn-more-btn">LEARN MORE</a>
        </div>
      </div>
      <div styleName="onoffswitch-no-padding-right">
        <input
          type="checkbox"
          name="eprf-onoffswitch"
          id={`pre-onoffswitch-${id}`}
          value={value}
          checked={checked}
          onChange={onToggle}
          className="onoffswitch-checkbox"
        />
        <label htmlFor={`pre-onoffswitch-${id}`} className="onoffswitch-label">
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
          <input type="hidden" />
        </label>
      </div>
    </div>
  );
}

Item.propTypes = {
  id: PT.string.isRequired,
  icon: PT.string.isRequired,
  value: PT.string.isRequired,
  checked: PT.bool.isRequired,
  title: PT.string.isRequired,
  description: PT.string.isRequired,
  link: PT.string.isRequired,
  onToggle: PT.func.isRequired,
};
