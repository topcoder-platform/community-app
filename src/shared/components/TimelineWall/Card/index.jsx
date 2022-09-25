import React, { useState } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import ArrowDown from 'assets/images/timeline/arrow-down.svg';

import moment from 'moment';
import Assets from './Assets';
import Footer from './Footer';

import './styles.scss';

const Card = ({ event, onSelectAsset }) => {
  const [opened, setOpened] = useState(true);

  const {
    eventName, description, createdBy, eventDate, assets = [], avatarUrl,
  } = event;

  const year = moment(eventDate).format('YYYY');
  const month = moment(eventDate).format('MMMM');

  return (
    <div styleName="card" id={`${year}-${month}`}>
      <div styleName="header">
        <h3 styleName="title">{eventName}</h3>

        <div
          role="presentation"
          styleName={classNames('icon', { revert: opened })}
          onClick={() => setOpened(!opened)}
        >
          <ArrowDown />
        </div>
      </div>

      <p styleName={classNames('description', { ellipsis: opened })}>{description}</p>

      <Assets assets={assets} onSelectAsset={onSelectAsset} />

      <Footer createdBy={createdBy} eventDate={eventDate} avatarUrl={avatarUrl} />
    </div>
  );
};

Card.defaultProps = {
  event: {},
};

Card.propTypes = {
  event: PT.shape(),
  onSelectAsset: PT.func.isRequired,
};

export default Card;
