import React from 'react';
import PT from 'prop-types';

import './styles.scss';
import CourseBadge from '../CourseBadge';

const preventDefault = ev => ev.stopPropagation();

const List = ({
  certificates,
  onClick,
}) => (
  <div styleName="list">
    {certificates.map(certificate => (
      <div
        styleName="list-item"
        key={certificate.id}
        onClick={() => onClick(certificate)}
        onKeyPress={() => onClick(certificate)}
        role="button"
        tabIndex={-1}
      >
        <div styleName="list-item_badge">
          <CourseBadge type={certificate.certificationTrackType || 'DEV'} />
        </div>
        <div>
          <div styleName="list-item_title">
            {certificate.certificationTitle}
          </div>
          <div styleName="list-item_sub">
            <a href={`//${certificate.providerUrl}`} target="blank" rel="noopener" onClick={preventDefault}>
              by {certificate.provider}
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
);

List.propTypes = {
  certificates: PT.arrayOf(PT.shape()).isRequired,
  onClick: PT.func.isRequired,
};

export default List;
