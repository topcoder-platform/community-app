/**
 * AssetList component of Assets page IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import assetsData from '../data/predix-assets.json';
import './styles.scss';

const AssetList = ({
  baseUrl,
  display,
}) => {
  const itemsStyleName = `assets-items ${display === 'grid' ? 'grid' : ''}`;
  return (
    <div styleName="assets-body">
      <ul styleName={itemsStyleName} >
        {
          assetsData.map((item) => {
            const detailUrl = `${baseUrl}/assets/${item.id}`;
            return (
              <li styleName="assets-item">
                <div styleName="col-asset col-asset-details">
                  <a href={detailUrl} styleName="icon"><span styleName="sr-only">icon</span></a>
                  <h2><a href={detailUrl} >{ item.title }</a></h2>

                  <div styleName="description">
                    <p>{ item.description }…</p>
                    <p styleName="links"><a href={detailUrl} styleName="details">More Details</a></p>
                    <p styleName="links"><a href={item.githubUrl} target="_blank" styleName="github">{ item.githubUrl }</a></p>
                  </div>
                </div>
                <div styleName="col-asset col-asset-technologies">
                  <strong>Technologies</strong>
                  <div styleName="technologies">
                    {
                    item.technologies.map(t => (
                        t.url ?
                          <a href={t.url}>{ t.title }</a>
                            : <span>{ t.title }</span>
                      ))
                  }
                  </div>
                </div>
                <div styleName="col-asset col-asset-platforms">
                  <strong>Platforms</strong>
                  <div styleName="platforms">
                    {
                    item.platforms.map(p => (
                        p.url ?
                          <a href={p.url}>{ p.title }</a>
                            : <span>{ p.title }</span>
                      ))
                  }
                  </div>
                </div>
                <div styleName="col-asset col-asset-links">
                  <a href={item.githubUrl} target="_blank" styleName="github">GitHub</a>
                  <a href={detailUrl} styleName="details">More Details</a>
                </div>
              </li>
            );
          })
      }
      </ul>
    </div>);
};
AssetList.propTypes = {
  baseUrl: PT.string.isRequired,
  display: PT.string.isRequired,
};

export default AssetList;
