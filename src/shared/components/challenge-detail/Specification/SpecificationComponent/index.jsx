import PT from 'prop-types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';

export default function SpecificationComponent({
  bodyText,
  format,
}) {
  if (format === 'markdown') {
    return (
      <ReactMarkdown
        remarkPlugins={[
          remarkMath,
          remarkFrontmatter,
          remarkParse,
          [remarkGfm, { singleTilde: false }],
        ]}
        rehypePlugins={[rehypeKatex, rehypeStringify]}
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
