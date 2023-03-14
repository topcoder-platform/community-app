import React from 'react';
import PT from 'prop-types';

import './styles.scss';

const preventDefault = ev => ev.stopPropagation();

const List = ({
  certificates,
  onClick,
  renderIcon,
}) => (
  <div styleName="list">
    {certificates.map(certificate => (
      <div
        styleName="list-item"
        key={certificate.id}
        onClick={() => onClick(certificate)}
        onKeyDown={() => onClick(certificate)}
        role="button"
        tabIndex={-1}
      >
        <div styleName="list-item_badge">
          {renderIcon(certificate)}
        </div>
        <div>
          <div styleName="list-item_title">
            {certificate.certificationTitle || certificate.topcoderCertification.title}
          </div>
          {certificate.resourceProvider && (
            <div styleName="list-item_sub">
              <a href={`//${certificate.resourceProvider.url}`} target="blank" rel="noopener" onClick={preventDefault}>
                by {certificate.resourceProvider.name}
              </a>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

List.propTypes = {
  certificates: PT.arrayOf(PT.shape()).isRequired,
  onClick: PT.func.isRequired,
  renderIcon: PT.element.isRequired,
};

export default List;
