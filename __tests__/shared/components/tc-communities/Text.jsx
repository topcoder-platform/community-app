import React from 'react';
import TU from 'react-dom/test-utils';
import Text from 'components/tc-communities/Text';

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return (<Text {...this.props}>
      <div>content</div>
    </Text>);
  }
}

test('Render properly', () => {
  TU.renderIntoDocument((
    <Wrapper />
  ));

  TU.renderIntoDocument((
    <Wrapper
      theme={{
        container: 'container',
      }}
    />
  ));
});
