/**
 * Container for EDU Portal home page.
 */
import React from 'react';
import { getService } from 'services/contentful';
// CSS

export default class ResultTabs extends React.Component {
  constructor(props) {
    super(props);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
  }

  render() {
    return null;
  }
}
