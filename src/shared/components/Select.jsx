import React from 'react';
import PT from 'prop-types';

import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';

export default function Select(props) {
  return (
    <ReactSelect {...props} instanceId={props.id} />
  );
}

Select.defaultProps = {

};

Select.propTypes = {
  id: PT.string.isRequired,
};
