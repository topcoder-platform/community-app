/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * EditTrackPanel component
 * Component that is displayed on mobile devices, to allow the user to change the tracks
 * ('Design', 'Development' or 'Data Science')
 *
 * Usage:
 *
 *     <EditTrackPanel
 *       opened={this.state.showEditTrackPanel}
 *       onClose={this.toggleEditTrackPanel.bind(this)}
 *       designEnabled={this.state.filter.tracks.has(DESIGN_TRACK)}
 *       switchDesign={enable => this.setTracks(DESIGN_TRACK, enable)}
 *       devEnabled={this.state.filter.tracks.has(DEVELOP_TRACK)}
 *       switchDev={enable => this.setTracks(DEVELOP_TRACK, enable)}
 *       dataScienceEnabled={this.state.filter.tracks.has(DATA_SCIENCE_TRACK)}
 *       switchDataScience={enable => this.setTracks(DATA_SCIENCE_TRACK, enable)}
 *    />
 */
import React from 'react';
import PT from 'prop-types';
import Switch from 'components/Switch';
import UiSimpleRemove from '../../Icons/ui-simple-remove.svg';
import './style.scss';

function EditTrackPanel({
  dataScienceEnabled,
  designEnabled,
  devEnabled,
  onClose,
  opened,
  switchDataScience,
  switchDesign,
  switchDev,
}) {
  return (
    <div styleName={`EditTrackPanel ${opened === true ? 'opened' : 'closed'}`}>
      <div styleName="header">
        <span styleName="title">
  Tracks
        </span>
        <span
          styleName="close-icon"
          onClick={() => onClose()}
          onKeyPress={() => onClose()}
        >
          <UiSimpleRemove />
        </span>
      </div>
      <div styleName="row">
        <span>
  Design
        </span>
        <Switch
          enabled={designEnabled}
          onSwitch={switchDesign}
        />
      </div>
      <div styleName="row">
        <span>
  Development
        </span>
        <Switch
          enabled={devEnabled}
          onSwitch={switchDev}
        />
      </div>
      <div styleName="row">
        <span>
  Data Science
        </span>
        <Switch
          enabled={dataScienceEnabled}
          onSwitch={switchDataScience}
        />
      </div>
    </div>
  );
}

EditTrackPanel.defaultProps = {
  opened: false,
};

EditTrackPanel.propTypes = {
  opened: PT.bool,
  onClose: PT.func.isRequired,
  designEnabled: PT.bool.isRequired,
  switchDesign: PT.func.isRequired,
  devEnabled: PT.bool.isRequired,
  switchDev: PT.func.isRequired,
  dataScienceEnabled: PT.bool.isRequired,
  switchDataScience: PT.func.isRequired,
};

export default EditTrackPanel;
