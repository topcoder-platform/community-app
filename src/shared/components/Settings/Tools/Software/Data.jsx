/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getSoftwareTypes } from 'utils/softwareTypes';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';
import SoftwareList from '../../../../../assets/images/softwarelist.svg';
import Styles from './styles.scss';

const softwareTypes = getSoftwareTypes();

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    console.log("Super props software Data", props);
    this.onUpdateSoftwareType= this.onUpdateSoftwareType.bind(this)
    this.onSaveToolsSoftware= this.onSaveToolsSoftware.bind(this);
    this.onUpdateName= this.onUpdateName.bind(this);
    this.onDeleteToolsSoftware= this.onDeleteToolsSoftware.bind(this);
  }
  onUpdateSoftwareType(type){
    this.props.onUpdateSoftwareType(type.name);
  }
  onUpdateName(){
    const name= document.querySelector('#software-name').value;
    this.props.onUpdateName(name);
  }
  onSaveToolsSoftware(e){
    e.preventDefault();
    const softwareType= this.props.softwareType;
    const name= this.props.name;
    const softwareobj= {
      "softwareType": softwareType,
      "name": name
    }    
    this.props.onUpdateSoftware(softwareobj);
    this.props.onSaveToolsSoftware(e);
  }
  onDeleteToolsSoftware(softwareName){
    this.props.onDeleteToolsSoftware(softwareName);
  }

  displaySoftwares(){
    return(
      this.props.softwares.map((softwareObj, key) => {
        return (
          <div style= {{border:"1px solid #ededf2", padding: "20px 20px", overflow: "hidden"}}>
          <div style= {{width: "6.7%", padding: "0", float: "left"}}>
          <SoftwareList />
          </div>
          <div style= {{width: "79.83%", marginLeft: "2.4%", float: "left"}}>
            <p style= {{fontFamily: "Roboto", marginBottom: "5px", fontSize: "16px", fontWeight: "550", lineHeight: "1.33", color: "#262628"}}>{softwareObj.name}</p>
  
            <p style= {{fontFamily: "Roboto", fontSize: "16px", color: "#888894", lineHeight: "1.33"}}>{softwareObj.softwareType}</p>
          </div>
          <div style= {{width: "8.367%", float: "left"}}>
          <a style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteToolsSoftware(softwareObj.name))}>
                  {/* <img src= "images/flag.jpg" style= {{height: "15px", width: "15px"}}/> */}
                  <p style= {{fontSize: "16px", marginTop: "10px", cursor: "pointer", fontFamily: "Roboto", textAlign: "center", lineHeight: "1.36", fontWeight: "550"}}>Delete</p>
                </a>
            </div>
          </div>
      )})
    );
    
}

  render() {
    const {
      softwareType,
      name
    }= this.props;

    return (
      <div style= {{padding: "0", float: "left", width: "100%"}}>
          <p styleName= 'titleP'>Software</p>
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2", padding: "20px", overflow: "hidden"}}>
            <p style= {{fontSize: "20px", color: "#262628", lineHeight: "1.5", marginBottom: "20px"}}>Add Software</p>
            <div style= {{width: "44.24%", paddingLeft: "0", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Software Type</p>
              <Select
                name="softwareType"
                options={softwareTypes}
                id= "software-type"
                value={softwareType}
                onChange={this.onUpdateSoftwareType}
                placeholder="Software Type"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div style= {{width: "55.75%", paddingLeft: "5px", paddingRight: "0", float: "left"}}>
              <p styleName= 'headingsP'>Name</p>
              <input type= "text" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} value={name} onChange={this.onUpdateName} id= "software-name" />
            </div>
            <div style={{textAlign: "center"}}>
            <PrimaryButton
            onClick={this.onSaveToolsSoftware}
            theme={{ button: Styles['save-button'] }}
          >
            Add Software
          </PrimaryButton>
          </div>
          </div>
          <br />
          <div style={{backgroundColor: "white", marginTop: "20px"}}>
          {this.displaySoftwares()}
        </div>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

