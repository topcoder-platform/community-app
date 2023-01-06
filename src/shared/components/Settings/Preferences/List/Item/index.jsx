/**
 * Render item of preferences
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import cn from 'classnames';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/preferences', false, /svg/);
}

export default function Item({
  icon,
  title,
  description,
  link,
  status,
  linkTitle,
  email,
  formLink,
  value,
  isForm,
}) {
  return (
    <div styleName={cn('item-container', status === 'subscribed' && 'subscribed')}>
      <div styleName="body">
        <div styleName="icon-wrapper">
          { assets && assets.keys().includes(`./${icon.toLowerCase()}.svg`) ? <ReactSVG path={assets(`./${icon.toLowerCase()}.svg`)} /> : '' }
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
          status && isForm && (
            <form action={formLink} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" noValidate>
              <input type="email" value={email} readOnly name="EMAIL" id="mce-EMAIL" />
              <input type="checkbox" id="gdpr_11101" name="gdpr[11101]" value="Y" />
              <input type="text" name="b_65bd5a1857b73643aad556093_28bfd3c062" tabIndex="-1" value="" />
              <input type="submit" value={value} name={value} id="mc-embedded-subscribe" className="submit-button" />
            </form>
          )
        }

        { !isForm && <a href={link} target="_blank" rel="noopener noreferrer" styleName="link-btn"><span>{ linkTitle }</span></a>}
      </div>
    </div>
  );
}

Item.defaultProps = {
  link: '',
  email: '',
  status: '',
  value: '',
  formLink: '',
  isForm: false,
};

Item.propTypes = {
  linkTitle: PT.string.isRequired,
  title: PT.string.isRequired,
  description: PT.string.isRequired,
  status: PT.string,
  link: PT.string,
  isForm: PT.bool,
  formLink: PT.string,
  value: PT.string,
  email: PT.string,
  icon: PT.string.isRequired,
};
