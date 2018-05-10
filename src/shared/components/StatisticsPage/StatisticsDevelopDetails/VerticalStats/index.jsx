/**
 * VerticalStats Component.  Displays an icon and label dynamically based on data.
 */
import React from 'react';
import './styles.scss';

const VerticalStats = (props) => (
    <li>
        <div>{props.left}</div>
        <div styleName="right">{props.right}</div>
    </li>
);

export default VerticalStats;
