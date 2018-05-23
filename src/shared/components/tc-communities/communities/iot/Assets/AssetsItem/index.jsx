/**
 * Assets Item component of Assets page IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import './styles.scss';
import Link from 'components/Link'
import TechAndPlatformsSection from '../../TechAndPlatformsSection';

const AssetsItem = (props) => (
  <div styleName={props.assetItemStyle}>
    <div styleName="col-asset col-asset-details">
      <Link to={`${props.base}/asset/${props.asset.detailsId}`}>
        <a styleName="icon">
          <span styleName="sr-only"/>
        </a>
      </Link>
      <h2>
        <Link to={`${props.base}/asset/${props.asset.detailsId}`}>{props.asset.title}</Link>
      </h2>
      <div styleName="description">
        <p>
          {props.asset.description}
        </p>
        <p styleName="links">
          <a styleName="details">
            More Details
          </a>
        </p>
        <p styleName="links">
          <a styleName="github">
            {props.asset.link}
          </a>
        </p>
      </div>
    </div>
    <div styleName="col-asset col-asset-technologies">
      <strong>Technologies</strong>
      <div styleName="technologies">
        <TechAndPlatformsSection values={props.asset.Technologies}/>
      </div>
    </div>

    <div styleName="col-asset col-asset-platforms">
      <strong>Platforms</strong>
      <div styleName="platforms">
        <TechAndPlatformsSection values={props.asset.Platforms}/>
      </div>
    </div>

    <div styleName="col-asset col-asset-links">
      <a styleName="github">Gitub</a>
      <a styleName="details">More Details</a>
    </div>
  </div>
);

export default AssetsItem;
