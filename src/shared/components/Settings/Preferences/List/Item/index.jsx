/**
 * Render item of preferences
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/preferences', false, /svg/);
}

export default function Item({
  id,
  title,
  description,
  link,
  linkTitle,
  email,
  isSubscribeForm,
}) {
  return (
    <div styleName="item-container">
      <div styleName="body">
        <div styleName="icon-wrapper">
          { assets && assets.keys().includes(`./${id.toLowerCase()}.svg`) ? <ReactSVG path={assets(`./${id.toLowerCase()}.svg`)} /> : '' }
        </div>
        <div styleName="info">
          <div styleName="info-first-line">
            { title }
          </div>
          <div styleName="info-second-line">
            { description }
          </div>
        </div>
        {
          !isSubscribeForm ? (
            <a href={link} target="_blank" rel="noopener noreferrer" styleName="link-btn"><span>{ linkTitle }</span></a>
          ) : (
            <form action="https://topcoder.us13.list-manage.com/subscribe/post?u=65bd5a1857b73643aad556093&amp;id=28bfd3c062" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" noValidate>
              <input type="email" value={email} readOnly name="EMAIL" id="mce-EMAIL" />
              <input type="checkbox" id="gdpr_11101" name="gdpr[11101]" value="Y" />
              <input type="text" name="b_65bd5a1857b73643aad556093_28bfd3c062" tabIndex="-1" value="" />
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="submit-button" />
            </form>
          )
        }
      </div>
    </div>
  );
}

Item.defaultProps = {
  link: '',
  isSubscribeForm: false,
  email: '',
};

Item.propTypes = {
  linkTitle: PT.string.isRequired,
  title: PT.string.isRequired,
  description: PT.string.isRequired,
  link: PT.string,
  isSubscribeForm: PT.bool,
  email: PT.string,
  id: PT.string.isRequired,
};
