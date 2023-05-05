import PT from 'prop-types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import LoadingIndicator from 'components/LoadingIndicator';
import { isomorphy } from 'topcoder-react-utils';
import style from './styles.scss';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';

export default function SpecificationComponent({
  bodyText,
  format,
}) {
  if (format === 'markdown') {
    if (!isomorphy.isClientSide()) {
      return (
        <LoadingIndicator />
      );
    }
    // eslint-disable-next-line global-require
    const remarkParse = require('remark-parse');
    return (
      <ReactMarkdown
        remarkPlugins={[
          remarkMath,
          remarkFrontmatter,
          remarkParse.default,
          [remarkGfm, { singleTilde: false }],
          remarkBreaks,
        ]}
        rehypePlugins={[rehypeKatex, rehypeStringify, rehypeRaw]}
        className={style.container}
      >
        {bodyText}
      </ReactMarkdown>
    );
  }
  return (
    <div
    /* eslint-disable react/no-danger */
      dangerouslySetInnerHTML={{
        __html: bodyText,
      }}
    /* eslint-enable react/no-danger */
      /* styleName="rawHtml" */
    />
  );
}

SpecificationComponent.defaultProps = {
  bodyText: '',
  format: 'HTML',
};

SpecificationComponent.propTypes = {
  bodyText: PT.string,
  format: PT.string,
};
