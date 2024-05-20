/**
 * Asset detail page of IoT community
 */
/* eslint-disable max-len */
/* eslint-disable react/no-danger */
import Error404 from 'components/Error404';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import JoinSection from '../JoinSection';
// import ShareSocial from './ShareSocial';
import './styles.scss';

import assetsData from '../Assets/data/predix-assets.json';

export default function AssetDetail({
  baseUrl,
  assetId,
}) {
  const assets = assetsData.filter(item => item.id === assetId);
  const asset = assets[0];
  return (
    typeof asset === 'undefined'
      ? <Error404 />
      : (
        <main styleName="main">
          <div styleName="assets-header">
            <div styleName="folder" />
            <h1>
              { asset.title }
            </h1>
          </div>
          <article>
            <div styleName="detail">
              <h2>
                Asset Details
              </h2>
              <div dangerouslySetInnerHTML={{ __html: asset.abstract }} />
              <p>
                <a href={asset.githubUrl} styleName="github">
                  { asset.githubUrl }
                </a>
              </p>
              <h2>
                Winner&#39;s Asset Details & Description
              </h2>
              <div dangerouslySetInnerHTML={{ __html: asset.content }} />
            </div>
            <aside>
              <div styleName="author">
                <div styleName="user-photo">
                  <img src={asset.author.avatarURL} alt="" />
                </div>

                <div styleName="info">
                  <h4>
                    Topcoder Winner
                  </h4>

                  <a href={asset.author.profileURL} target="_blank" rel="noreferrer noopener">
                    { asset.author.name }
                  </a>
                  <div>
                    { asset.author.country }
                  </div>
                </div>
              </div>
              <div styleName="technologies">
                <h4>
                  Technologies
                </h4>
                {
                asset.technologies.map(t => (
                  t.url
                    ? (
                      <a href={t.url}>
                        { t.title }
                      </a>
                    )
                    : (
                      <span>
                        { t.title }
                      </span>
                    )
                ))
               }
              </div>
              <div styleName="platforms">
                <h4>
                  platforms
                </h4>
                {
                asset.platforms.map(p => (
                  p.url
                    ? (
                      <a href={p.url}>
                        { p.title }
                      </a>
                    )
                    : (
                      <span>
                        { p.title }
                      </span>
                    )
                ))
               }
              </div>
              <div styleName="buttonContainer">
                <PrimaryButton to={asset.githubUrl} onClick={evt => evt.preventDefault()}>
                  Download
                </PrimaryButton>
              </div>

              {/* <ShareSocial /> */}

            </aside>

          </article>

          <JoinSection
            baseUrl={baseUrl}
          />
        </main>
      )
  );
}

AssetDetail.propTypes = {
  baseUrl: PT.string.isRequired,
  assetId: PT.string.isRequired,
};
