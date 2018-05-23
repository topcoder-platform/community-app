/**
 * Top Banner component of About page IoT community
 */
import './styles.scss';
import React from 'react';
import PT from 'prop-types';
import Link from 'components/Link'

const TechAndPlatformsSection = ({
  values,
}) => (
  <div>
    {
      values.map((item, index)=>{
        return (
          item.link?<Link key={index} to={`/community/iot/asset/Predix`} >
            <span key={index}>{item.value}</span>
          </Link>
          :<span key={index}>{item.value}</span>
        )
      })
    }
  </div>
);

export default TechAndPlatformsSection;
