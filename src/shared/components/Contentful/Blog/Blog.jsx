/**
 * The core blog rendering.
 */

import PT from 'prop-types';
import React, { Component } from 'react';
import { fixStyle } from 'utils/contentful';
import { themr } from 'react-css-super-themr';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';
import Error404 from 'components/Error404';
import defaultTheme from './themes/default.scss';
import blogListDefault from './themes/blogListDefault.scss';
import Left from '../../../../assets/images/left-arrow.svg';
import Right from '../../../../assets/images/right-arrow.svg';
import DoubleLeft from '../../../../assets/images/double-left-arrows.svg';
import DoubleRight from '../../../../assets/images/double-right-arrows.svg';
import BlogListView from '../BlogPost/ListView';

const THEMES = {
  Default: blogListDefault,
};

/* Loads blog post hero image asset. */
function HeroImageLoader(props) {
  const { blogPost, preview } = props;
  const { heroImage } = blogPost;
  if (heroImage) {
    const assetId = heroImage.sys.id;
    return (
      <ContentfulLoader
        assetIds={assetId}
        preview={preview}
        render={data => (
          <BlogListView
            {...props}
            heroImage={data.assets.items[assetId].fields}
            theme={fixStyle(THEMES[blogPost.theme])}
          />
        )}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
  return <BlogListView {...props} theme={THEMES[blogPost.theme]} />;
}

HeroImageLoader.propTypes = {
  blogPost: PT.shape().isRequired,
  id: PT.string.isRequired,
  preview: PT.bool.isRequired,
  sys: PT.shape().isRequired,
};

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPageNo: '',
    };
    this.updateInput = this.updateInput.bind(this);
  }

  updateInput(event) {
    this.setState({ inputPageNo: event.target.value });
  }

  render() {
    const {
      theme,
      blogPosts,
      pageNo,
      totalPage,
      handleSubmit,
      baseUrl,
    } = this.props;

    const { inputPageNo } = this.state;
    const BlogPosts = Object.keys(blogPosts).map(key => (
      <HeroImageLoader
        {...this.props}
        key={key}
        id={key}
        blogPost={blogPosts[key].fields}
        sys={blogPosts[key].sys}
        readMoreLink={`${baseUrl}/${blogPosts[key].fields.slug}`}
      />
    ));
    return totalPage > 0 ? (
      <div
        className={theme.container}
      >
        {/* Blog Posts */}
        <div className={theme.blogPostsWrapper}>
          {BlogPosts}
        </div>
        { /* Pagination */ }
        <div
          className={theme.pagination}
        >
          <div className={theme.paginationLinks}>
            <Link to={`${baseUrl}/1`} className={pageNo === 1 ? theme.disabledLink : ''}>
              <DoubleLeft className={theme.icon} />
            </Link>
            <Link
              to={`${baseUrl}/${pageNo > 1 ? pageNo - 1 : 1}`}
              className={pageNo === 1 ? theme.disabledLink : ''}
            >
              <Left className={theme.icon} />
            </Link>
            <div className={theme.pageCounter}> Page {pageNo} of {totalPage} </div>
            <Link
              to={`${baseUrl}/${pageNo < totalPage ? pageNo + 1 : totalPage}`}
              className={totalPage === pageNo ? theme.disabledLink : ''}
            >
              <Right className={theme.icon} />
            </Link>
            <Link
              to={`${baseUrl}/${totalPage}`}
              className={totalPage === pageNo ? theme.disabledLink : ''}
            >
              <DoubleRight className={theme.icon} />
            </Link>
          </div>
          <form
            className={theme.pageCounter}
            style={{ marginLeft: '20px' }}
            onSubmit={event => handleSubmit(event, inputPageNo)}
          >
            Go to Page
            <input
              className={theme.pageNumber}
              type="text"
              value={inputPageNo}
              onChange={this.updateInput}
              readOnly={totalPage === 1}
            />
            <PrimaryButton
              type="submit"
              theme={{ button: theme.button }}
              disabled={
                totalPage === 1
                || !inputPageNo
                || !parseInt(inputPageNo, 10)
                || (inputPageNo > totalPage || inputPageNo < 1)}
            >Go
            </PrimaryButton>
          </form>
        </div>
      </div>
    ) : Error404();
  }
}

Blog.propTypes = {
  blogPosts: PT.shape().isRequired,
  theme: PT.shape({
    container: PT.string.isRequired,
    blogPostsWrapper: PT.string.isRequired,
    pagination: PT.string.isRequired,
    icon: PT.string.isRequired,
    pageCounter: PT.string.isRequired,
    pageNumber: PT.string.isRequired,
    button: PT.string.isRequired,
    paginationLinks: PT.string,
    disabledLink: PT.string,
  }).isRequired,
  pageNo: PT.number.isRequired,
  totalPage: PT.number.isRequired,
  handleSubmit: PT.func.isRequired,
  baseUrl: PT.string.isRequired,
  preview: PT.bool.isRequired,
};

export default themr('Contentful-Blog', defaultTheme)(Blog);
