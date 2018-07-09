/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Data from './Data';

import Styles from './styles.scss';

export default class Software extends React.Component {
    constructor(props) {
        super(props);
        console.log("Software props", props)
        this.state = {
          softwares:props.software.traits.data,
          softwareType:'',
          name: ''
        }
        this.onUpdateSoftwareType= this.onUpdateSoftwareType.bind(this);
        this.onUpdateName= this.onUpdateName.bind(this);
        this.onUpdateSoftware= this.onUpdateSoftware.bind(this);
        this.onSaveToolsSoftware= this.onSaveToolsSoftware.bind(this);
        this.onDeleteToolsSoftware= this.onDeleteToolsSoftware.bind(this)
      }
      onUpdateSoftwareType(softwareType) {
        this.setState({ softwareType });
      }
      onUpdateName(name) {
        this.setState({ name });
      }
      onUpdateSoftware(softwareobj) {
        const softwareObjects= this.state.softwares;
        console.log("Software objects", softwareObjects)
        softwareObjects.push(softwareobj);
        this.setState({software:softwareObjects});
      }
      onSaveToolsSoftware(e) {
        e.preventDefault();
        const newSoftware= _.clone(this.props.software);
        newSoftware.traits.data= this.state.softwares;
        console.log("New Softwares", newSoftware)
        this.props.updateSoftware(newSoftware, this.props.handle);
      }
      onDeleteToolsSoftware(softwareobj){
        _.remove(this.state.softwares, software => software.name===softwareobj);
        this.setState({softwares: this.state.softwares});
        const newSoftware= _.clone(this.props.software);
        newSoftware.traits.data= this.state.softwares;
        this.props.updateSoftware(newSoftware, this.props.handle);
      }
      render() {
          return (
              <Data 
                softwares= {this.state.softwares}
                softwareType= {this.state.softwareType}
                name= {this.state.name}
                onUpdateSoftwareType= {this.onUpdateSoftwareType}
                onUpdateName= {this.onUpdateName}
                onUpdateSoftware= {this.onUpdateSoftware}
                onSaveToolsSoftware= {this.onSaveToolsSoftware}
                onDeleteToolsSoftware= {this.onDeleteToolsSoftware}
              {...this.props}
              />
          );

      }

}