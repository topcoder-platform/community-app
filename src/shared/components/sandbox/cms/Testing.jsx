import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
// import PT from 'prop-types';
import React from 'react';

export default class Testing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // query: null,
    };

    setTimeout(() => this.setState({
      // query: ['22k5Cuv40YG4my6IY28sSw'],
    }), 3000);
  }

  render() {
    return (
      <div>
        <ContentfulLoader
          assetQueries
          render={data => <pre>{JSON.stringify(data, null, '  ')}</pre>}
          renderPlaceholder={() => 'LOADING'}
        />
      </div>
    );
  }
}
