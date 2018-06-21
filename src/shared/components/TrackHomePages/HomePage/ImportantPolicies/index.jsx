/**
 * Important Policies components.
 */

import React from 'react';
import PT from 'prop-types';

import './styles.scss';

const ImportantPolicies = ({ data }) => (
  <div styleName="container">
    {
      data.policies.map(policy => (
        <div key={policy.title} styleName="policy">
          <img styleName="icon" src={policy.icon.file.url} alt="Policy" />
          <div styleName="title">{policy.title}</div>
          <div styleName="text">{policy.shortDescription}</div>
        </div>
      ))
    }
  </div>
);

ImportantPolicies.propTypes = {
  data: PT.shape().isRequired,
};

export default ImportantPolicies;
