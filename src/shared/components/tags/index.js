import { GenericButton } from 'components/buttons';
import { themr } from 'react-css-super-themr';

import defaultTag from './default.scss';
import primaryDesignTag from './primary/design.scss';
import eventDesignTag from './event/design.scss';

export const Tag =
  themr('Tag', defaultTag)(GenericButton);

export const PrimaryTag =
  themr('PrimaryTag', primaryDesignTag)(GenericButton);

export const EventTag =
  themr('EventTag', eventDesignTag)(GenericButton);

export default Tag;
