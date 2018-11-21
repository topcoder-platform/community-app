/**
 * FAQ Component
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

import QAComponent from '../QAComponent';

const FAQ = ({ data, hashLink }) => (
  <div styleName="container">
    {
      data.AQs.map((question, index) => (
        <QAComponent
          data={question.fields}
          key={question.fields.title}
          isLastItem={(index + 1) === data.AQs.length ? 'last-item' : ''}
          isActive={hashLink === question.fields.title}
        />
      ))
    }
  </div>
);


FAQ.propTypes = {
  data: PT.shape().isRequired,
  hashLink: PT.string.isRequired,
};

export default FAQ;
