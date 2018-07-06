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
// var showGrad= 'Not Graduated';
export default class Education extends React.Component {
    constructor(props) {
        super(props);
        console.log("Education props", props)
        this.state = {
          educations:props.education.traits.data,
          type: '',
          name: '',
          major: '',
          startDate: '',
          endDate: '',
          graduated: false
        };
        this.onUpdateType= this.onUpdateType.bind(this);
        this.onUpdateName= this.onUpdateName.bind(this);
        this.onUpdateMajor= this.onUpdateMajor.bind(this);
        this.onUpdateGraduated= this.onUpdateGraduated.bind(this);
        this.onUpdateStartDate= this.onUpdateStartDate.bind(this);
        this.onUpdateEndDate= this.onUpdateEndDate.bind(this);
        this.onUpdateEducation= this.onUpdateEducation.bind(this);
        this.onSaveProfileEducation= this.onSaveProfileEducation.bind(this);
        this.onDeleteProfileEducation= this.onDeleteProfileEducation.bind(this);
        
      }
      onDeleteProfileEducation(educationobj){
        _.remove(this.state.educations, education => education.schoolCollegeName===educationobj);
        this.setState({educations: this.state.educations});
        const newEducation= _.clone(this.props.education);
        newEducation.traits.data= this.state.educations;
        this.props.updateEducation(newEducation, this.props.handle);
      }
      onUpdateType(type) {
        this.setState({ type });
      }
      onUpdateName(name) {
        this.setState({ name });
      }

      onUpdateMajor(major) {
        this.setState({ major });
      }
      onUpdateGraduated(isGraduatedBool) {
        // console.log("isGraduatedBool", isGraduatedBool)
        this.setState({ graduated: isGraduatedBool });
        // console.log("this.state.graduated", this.state.graduated);
        // showGrad= this.state.graduated? 'Not Graduated': 'Graduated';
      }
      onUpdateStartDate(startDate){
        this.setState({ startDate });
      }
      onUpdateEndDate(endDate){
        this.setState({ endDate });
      }
      onUpdateEducation(educationobj){
        const educationObjects= this.state.educations;
        console.log("Education objects", educationObjects)
        educationObjects.push(educationobj);
        this.setState({educations:educationObjects});
      }
      onSaveProfileEducation(e){
        e.preventDefault();
        const newEducation= _.clone(this.props.education);
        newEducation.traits.data= this.state.educations;
        console.log("New Education", newEducation)
        this.props.updateEducation(newEducation, this.props.handle);
      }
      render() {
          return (
              <Data 
              type= {this.state.type}
              name= {this.state.name}
              major= {this.state.major}
              startDate= {this.state.startDate}
              endDate= {this.state.endDate}
              graduated= {this.state.graduated}
              educations= {this.state.educations}
              onUpdateType= {this.onUpdateType}
              onUpdateName= {this.onUpdateName}
              onUpdateMajor= {this.onUpdateMajor}
              onUpdateGraduated= {this.onUpdateGraduated}
              onUpdateStartDate= {this.onUpdateStartDate}
              onUpdateEndDate= {this.onUpdateEndDate}
              onUpdateEducation= {this.onUpdateEducation}
              onSaveProfileEducation= {this.onSaveProfileEducation}
              onDeleteProfileEducation= {this.onDeleteProfileEducation}
              />
          );

      }

}