/**
 * Child component of Settings/Header renders summary of number of active challenges.
 * Also renders special badges based on achievements data.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ToolsSubtabs from '../ToolsSubtabs';


export default function Navbar(props) {
    const {subTab}= props;
  const selectTab = (tab) => {
      console.log("Select tab", tab);
      var sTab= 'tools';
      const tab1= sTab+"/"+tab;
      props.selectTab(tab1);
      props.history.push(`/settings/tools/${tab}`);
    };
  return (
      
        <ToolsSubtabs
          subTab= {subTab}
          selectTab= {selectTab}
        />
        
  );
}

Navbar.defaultProps = {
  
};

Navbar.propTypes = {
};

