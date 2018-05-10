/**
 * StatisticsCarousel Component.  Displays an icon and label dynamically based on data.
 */
import React from 'react';
import './styles.scss';
import SubtrackStats from '../SubtrackStats';

const StatisticsCarousel = (props) => (
    <div styleName="subtrack-stats">
        <div styleName="tc-carousel">
            <ul slide-count={Object.keys(props.subtrackArray).length}>
                <li>
                    {Object.keys(props.subtrackArray).map((label, index)=>{
                        return(
                            <SubtrackStats
                                key={index}
                                label={label}
                                value={props.subtrackArray[label]}
                            />
                        );
                    })}
                </li>
            </ul>
        </div>
    </div>
);

export default StatisticsCarousel;
