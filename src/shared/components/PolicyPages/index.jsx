/**
 * PolicyPages component.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import { config, Link } from 'topcoder-react-utils';
import cn from 'classnames';
import ContentBlock from 'components/Contentful/ContentBlock';
import Error404 from 'components/Error404';
import './styles.scss';

const menuItems = (policyData, slug) => _.map(policyData, item => (
  <li key={item.slug} styleName={cn({ active: slug === item.slug })}>
    <Link to={`${config.POLICY_PAGES_PATH}/${item.slug}`}>{item.menuLinkText}</Link>
  </li>
));

function PolicyPages({
  match,
  policyData,
}) {
  let { slug } = match.params;
  const pages = policyData.Policies.concat(policyData.Legal);
  if (!slug) {
    // eslint-disable-next-line prefer-destructuring
    slug = pages[0].slug;
  }
  const policyPage = _.find(pages, { slug });
  console.log('PolicyPages', slug, policyData, policyPage, pages[0]);
  return (
    <div styleName="policy-pages-container">
      <Sticky top=".policy-pages-container">
        <div styleName="navi">
          <p styleName="navi-section-title">Policies</p>
          <ul styleName="navi-section">{menuItems(policyData.Policies, slug)}</ul>
          <p styleName="navi-section-title2">Legal</p>
          <ul styleName="navi-section">{menuItems(policyData.Legal, slug)}</ul>
        </div>
      </Sticky>
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

PolicyPages.defaultProps = {

};

PolicyPages.propTypes = {
  match: PT.shape().isRequired,
  policyData: PT.shape().isRequired,
};

export default PolicyPages;
