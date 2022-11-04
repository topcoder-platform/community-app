import React from 'react';
import Interests from './Interests';
import Languages from './Languages';
import Skills from './Skills';

import './styles.scss';

export default class WorkSkills extends React.Component {
  constructor(props) {
    super(props);
    this.interestsRef = React.createRef();
    this.languagesRef = React.createRef();
    this.skillsRef = React.createRef();
  }

  render() {
    return (
      <div styleName="workSkills">
        <h2 styleName="title">Skills</h2>
        <Skills
          {...this.props}
          ref={this.skillsRef}
        />
        <Languages
          {...this.props}
          ref={this.languagesRef}
        />
        <Interests
          {...this.props}
          ref={this.interestsRef}
        />
      </div>
    );
  }
}
