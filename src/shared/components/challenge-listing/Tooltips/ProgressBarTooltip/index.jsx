import moment from 'moment';
import _ from 'lodash';
/**
 * Progress Bar Tooltip.
 *
 * It renders the tooltip with detailed timeline of a specified challenge.
 * As TC API v2 does not provide all necessary information for some types of
 * challenges, this component does not work perfect yet.
 * Component updated to use TC API v3 api.
 *
 * USAGE:
 * Wrap with <ProgressBarTooltip></ProgressBarTooltip> the element(s) which should
 * show the tooltip when hovered. Pass in the challenge details object via the
 * 'challenge' prop.
 */

import React from 'react';
import PT from 'prop-types';
import Tooltip from 'components/Tooltip';
import LoaderIcon from '../../../Loader/Loader';
import './style.scss';

const ID_LENGTH = 6;

const getDate = date => moment(date).format('MMM DD');
const getTime = (date) => {
  const duration = moment(date);
  const hour = duration.hours();
  const hString = hour < 10 ? `0${hour}` : hour;
  const min = duration.minutes();
  const mString = min < 10 ? `0${min}` : min;
  const res = `${hString}:${mString}`;
  return res[1] === '-' ? 'Late' : `${res}`;
};

/**
 * Renders a separate challenge phase element.
 * It includes: phase name, starting date, the point, representing the starting
 * date, the bar with inner-bar, representing the progress.
 * @param {Date} props.date Starting date of the phase.
 * @param {Boolean} props.last If true, the 'last' class will be added to the progress
 *  bar, allowing to hide it for the last phase element, which represent the end point
 *  of the challenge.
 * @param {String} props.phase Name of the phase.
 * @param {String} props.progress The progress of the phase. It will set the width
 *  of the colored part of the progress bar.
 * @param {Boolean} props.started When true, the 'started' class is added to the
 *  progress bar, allowing to color the point at its start.
 * @param {String} props.width The width of the phase element in the UI.
 */
function Phase(props) {
  const progress = props.progress;
  const limitProgress = parseFloat(_.replace(progress, '%', ''));
  const limitWidth = limitProgress <= 100 ? limitProgress : 100;
  return (
    <div styleName="phase">
      <div>{props.phase}</div>
      <div styleName={`bar ${props.last ? 'last' : ''} ${props.started ? 'started' : ''}`}>
        <div styleName="point" />
        <div styleName="inner-bar" style={{ width: `${limitWidth}%` }} />
      </div>
      <div styleName="date">
        {props.isLoaded ? `${getDate(props.date)}, ${getTime(props.date)}` : <LoaderIcon type="small" />}
      </div>
    </div>
  );
}

Phase.defaultProps = {
  isLoaded: false,
};

Phase.propTypes = {
  date: PT.shape({}).isRequired,
  last: PT.bool.isRequired,
  phase: PT.string.isRequired,
  progress: PT.string.isRequired,
  started: PT.bool.isRequired,
  isLoaded: PT.bool,
};

/**
 * Renders the tooltip's content.
 */
function Tip(props) {
  let steps = [];
  const c = props.challenge;
  const isLoaded = props.isLoaded;
  if (!c || _.isEmpty(c)) return <div />;
  // TC API v2 does not provide detailed information on challenge phases,
  // it just includes some deadlines into the challenge details. The code below,
  // sorts these deadlines by their dates, and then generates the challenge timeline.
  // The result should be fine for simple dev challenges, but will be strange for
  // such as Assembly, etc.
  // Component is updated with TC API v3
  const endPhaseDate = Math.max(...c.allPhases.map(d => new Date(d.scheduledEndTime)));
  steps.push({
    date: new Date(c.registrationStartDate),
    name: 'Start',
  });
  if (c.checkpointSubmissionEndDate) {
    steps.push({
      date: new Date(c.checkpointSubmissionEndDate),
      name: 'Checkpoint',
    });
  }
  const iterativeReviewPhase = c.currentPhases.find(phase => phase.phaseStatus === 'Open' && phase.phaseType === 'Iterative Review');
  if (iterativeReviewPhase) {
    steps.push({
      date: new Date(iterativeReviewPhase.scheduledEndTime),
      name: 'Iterative Review',
    });
  } else {
    steps.push({
      date: new Date(c.submissionEndDate),
      name: 'Submission',
    });
  }
  steps.push({
    date: new Date(endPhaseDate),
    name: 'End',
  });

  steps = steps.sort((a, b) => a.date.getTime() - b.date.getTime());
  const currentPhaseEnd = new Date();
  steps = steps.map((step, index) => {
    let progress = 0;
    if (index < steps.length - 1) {
      if (steps[1 + index].date.getTime() < currentPhaseEnd.getTime()) progress = 100;
      else if (step.date.getTime() > currentPhaseEnd.getTime()) progress = 0;
      else {
        const left = (currentPhaseEnd.getTime() - step.date.getTime());
        if (left < 0) progress = -1;
        else {
          progress = 100 * (left / (steps[1 + index].date.getTime() - steps[index].date.getTime()));
        }
      }
    }

    const phaseId = index;
    return (
      <Phase
        date={step.date}
        key={phaseId}
        last={index === steps.length - 1}
        phase={step.name}
        progress={`${progress}%`}
        started={step.date.getTime() < currentPhaseEnd.getTime()}
        isLoaded={isLoaded}
      />
    );
  });

  return (
    <div styleName="progress-bar-tooltip">
      <div styleName="tip">
        {steps}
      </div>
    </div>
  );
}

Tip.defaultProps = {
  isLoaded: false,
};

Tip.propTypes = {
  challenge: PT.shape({}).isRequired,
  isLoaded: PT.bool,
};

/** Handles arrow placement of the Progressbar tooltip
 *  because rc-tooltip doesnot display arrow correctly
 *  for progressbar tooltip out of the box.
 */
function placeArrow(TooltipNode) {
  const toolTip = TooltipNode;
  const arrow = TooltipNode.querySelector('.rc-tooltip-arrow');
  const rootTopOffset = this.getRootDomNode().getBoundingClientRect().top;
  const tooltipTopOffset = TooltipNode.getBoundingClientRect().top;

  if (rootTopOffset < tooltipTopOffset) {
    toolTip.style.top = `${parseInt(toolTip.style.top, 10) - 20}px`;
    arrow.style.top = '-5px';
  } else {
    arrow.style.top = '100%';
  }
}

/**
 * Renders the tooltip.
 */
class ProgressBarTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chDetails: {},
    };
    this.onTooltipHover = this.onTooltipHover.bind(this);
  }
  onTooltipHover() {
    const that = this;
    const chClone = _.clone(this.props.challenge);
    let details = {};
    const chId = `${chClone.id}`;
    details = chClone;
    if (chId.length < ID_LENGTH) {
      details.postingDate = chClone.startDate;
      details.registrationEndDate = chClone.endDate;
      details.submissionEndDate = chClone.endDate;
      details.appealsEndDate = chClone.endDate;
    }
    that.setState({
      chDetails: details,
    });
  }
  render() {
    const tip = <Tip challenge={this.state.chDetails} isLoaded />;
    return (
      <Tooltip
        className="progress-bar-tooltip"
        content={tip}
        align={{
          offset: [0, -15],
        }}
        onTooltipHover={this.onTooltipHover}
        placeArrow={placeArrow}
      >
        {this.props.children}
      </Tooltip>
    );
  }
}
ProgressBarTooltip.defaultProps = {
  challenge: {},
};

ProgressBarTooltip.propTypes = {
  challenge: PT.shape({}),
  children: PT.node.isRequired,
};

export default ProgressBarTooltip;
