/**
 * PolicyPages component.
 */
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import { config, Link, isomorphy } from 'topcoder-react-utils';
import cn from 'classnames';
import ContentBlock from 'components/Contentful/ContentBlock';
import Error404 from 'components/Error404';
import MediaQuery from 'react-responsive';
import './styles.scss';

const menuItems = (policyDataMenu, slug) => _.map(policyDataMenu, item => (
  <li key={item.slug} styleName={cn({ active: slug === item.slug })}>
    <Link to={`${config.POLICY_PAGES_PATH}/${item.slug}`}>{item.menuLinkText}</Link>
  </li>
));

function PolicyPages({
  match,
  policyData,
}) {
  const [mNavi, setMNavi] = useState({ policies: false, legal: false });

  function handeSectionClick() {
    setMNavi({
      policies: this === 'policies', legal: this === 'legal',
    });
  }
  // auto scroll to anchors
  useEffect(() => {
    if (isomorphy.isClientSide()) {
      const { hash } = window.location;
      setTimeout(() => {
        const anchor = document.getElementById(hash ? hash.slice(1) : null);
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
      }, 2000);
    }
  });

  let { slug } = match.params;
  const pages = policyData.Policies.concat(policyData.Legal);
  if (!slug) {
    // eslint-disable-next-line prefer-destructuring
    slug = pages[0].slug;
  }
  const policyPage = _.find(pages, { slug });
  return (
    <div styleName="policy-pages-container">
      <MediaQuery minWidth={769}>
        <Sticky top=".policy-pages-container">
          <div styleName="navi">
            <p styleName="navi-section-title">Policies</p>
            <ul styleName="navi-section">{menuItems(policyData.Policies, slug)}</ul>
            <p styleName="navi-section-title2">Legal</p>
            <ul styleName="navi-section">{menuItems(policyData.Legal, slug)}</ul>
          </div>
        </Sticky>
      </MediaQuery>
      <MediaQuery maxWidth={768}>
        <div styleName="mobile-navi">
          <div
            role="button"
            tabIndex="0"
            styleName={cn('mobile-navi-section-title', { active: mNavi.policies === true })}
            onClick={handeSectionClick.bind('policies')}
            onKeyUp={handeSectionClick.bind('policies')}
          >
            Policies
          </div>
          <ul
            styleName={cn('mobile-navi-section', { active: mNavi.policies === true })}
          >
            {menuItems(policyData.Policies, slug)}
          </ul>
          <div
            role="button"
            tabIndex="0"
            styleName={cn('mobile-navi-section-title', { active: mNavi.legal === true })}
            onClick={handeSectionClick.bind('legal')}
            onKeyUp={handeSectionClick.bind('legal')}
          >
            Legal
          </div>
          <ul
            styleName={cn('mobile-navi-section', { active: mNavi.legal === true })}
          >
            {menuItems(policyData.Legal, slug)}
          </ul>
        </div>
      </MediaQuery>
      <div styleName="page-content">
        {
          slug && !policyPage ? (
            <Error404 />
          ) : (
            <ContentBlock id={policyPage.pageContent.sys.id} />
          )
        }
      </div>
    </div>
  );
}

PolicyPages.propTypes = {
  match: PT.shape().isRequired,
  policyData: PT.shape().isRequired,
};

export default PolicyPages;
