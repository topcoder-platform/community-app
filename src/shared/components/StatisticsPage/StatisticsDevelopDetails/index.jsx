/**
 * StatisticsDevelopDetails Component.  Displays an icon and label dynamically based on data.
 */
import React from 'react';
import PT from 'prop-types';
import { truncate } from 'lodash';
import './styles.scss';
import SubtrackStats from '../SubtrackStats';
import VerticalStats from './VerticalStats';


const StatisticsDevelopDetails = (props) => (
    <div styleName="develop">
        <div styleName="bottom">
            <h2 styleName="detailed">Details</h2>
            <ul styleName="vertical-stats">
                {
                    Object.keys(props.subtrackDetailsArray).map((keys, index)=>{
                        return(
                            <VerticalStats
                                key={index}
                                left={keys}
                                right={props.subtrackDetailsArray[keys]}
                            />
                        )
                    })
                }
            </ul>
        </div>
    </div>
);

export default StatisticsDevelopDetails;
