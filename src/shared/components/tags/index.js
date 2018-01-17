import { GenericButton } from 'components/buttons';
import { themr } from 'react-css-super-themr';

import defaultTag from './default.scss';

import dataScienceTrackTag from './primary/data-science.scss';
import designTrackTag from './primary/design.scss';
import developmentTrackTag from './primary/develop.scss';

import dataScienceTrackEventTag from './event/data-science.scss';
import designTrackEventTag from './event/design.scss';
import developmentTrackEventTag from './event/develop.scss';

export const Tag =
  themr('Tag', defaultTag)(GenericButton);

export const DataScienceTrackTag =
  themr('DataScienceTrackTag', dataScienceTrackTag)(GenericButton);
export const DataScienceTrackEventTag =
  themr('DataScienceTrackEventTag', dataScienceTrackEventTag)(GenericButton);

export const DesignTrackTag =
  themr('DesignTrackTag', designTrackTag)(GenericButton);
export const DesignTrackEventTag =
  themr('DesignTrackEventTag', designTrackEventTag)(GenericButton);

export const DevelopmentTrackTag =
  themr('DevelopmentTrackTag', developmentTrackTag)(GenericButton);
export const DevelopmentTrackEventTag =
  themr('DevelopmentTrackEventTag', developmentTrackEventTag)(GenericButton);

export default Tag;
