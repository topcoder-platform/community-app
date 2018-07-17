/**
 * Important Policies components.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';

import './styles.scss';

const ImportantPolicies = ({ data }) => {
  const datas = data;
  const entryIds = _.map(datas.policies, item => (item.sys.id));
  return (
    <ContentfulLoader
      entryIds={entryIds}
      render={(result) => {
        for (let i = 0; i !== entryIds.length; i += 1) {
          datas.policies[i].fields = result.entries.items[entryIds[i]].fields;
        }
        const assetIds = _.map(data.policies, item => (item.fields.icon.sys.id));
        return (
          <ContentfulLoader
            assetIds={assetIds}
            render={(iconResult) => {
              for (let i = 0; i !== assetIds.length; i += 1) {
                datas.policies[i].fields.icon.fields = iconResult.assets.items[assetIds[i]].fields;
              }
              return (
                <div styleName="container">
                  {
                    datas.policies.map(policy => (
                      <div key={policy.fields.title} styleName="policy">
                        <a href={policy.fields.linkUrl} styleName="icon">
                          <img styleName="icon" src={policy.fields.icon.fields.file.url} alt="Policy" />
                        </a>
                        <a href={policy.fields.linkUrl} styleName="title">
                          {policy.fields.title}
                        </a>
                        <div styleName="text">
                          {policy.fields.shortDescription}
                        </div>
                      </div>
                    ))
                  }
                </div>
              );
            }}
          />
        );
      }}
    />
  );
};

ImportantPolicies.propTypes = {
  data: PT.shape().isRequired,
};

export default ImportantPolicies;
