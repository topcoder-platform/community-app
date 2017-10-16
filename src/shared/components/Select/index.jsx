import React from 'react';

import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';
import style from './style.scss';

/* TODO: Do we really need the instanceId? */
export default function Select(props) {
  return (
    <ReactSelect
      {...props}
      autosize={false}
      className={style.select}
    />
  );
}
