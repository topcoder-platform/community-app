import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <NewsletterSignup
      title="Sign up for our newsletter"
      text="Don’t miss out on the latest Topcoder IOS challenges and information!"
      imageSrc="/themes/wipro/subscribe-bg.jpg"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <NewsletterSignup
      title="Sign up for our newsletter"
      text="Don’t miss out on the latest Topcoder IOS challenges and information!"
      imageSrc="/themes/wipro/subscribe-bg.jpg"
      theme={{
        container: 'container',
        content: 'content',
        title: 'title',
        text: 'text',
        form: 'form',
        formEmail: 'formEmail',
        formButton: 'formButton',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <NewsletterSignup {...this.props} />
    );
  }
}

const instance = TU.renderIntoDocument((
  <Wrapper
    title="Sign up for our newsletter"
    text="Don’t miss out on the latest Topcoder IOS challenges and information!"
    imageSrc="/themes/wipro/subscribe-bg.jpg"
    theme={{
      container: 'container',
      content: 'content',
      title: 'title',
      text: 'text',
      form: 'form',
      formEmail: 'formEmail',
      formButton: 'formButton',
    }}
  />
));

describe('handle click', () => {
  beforeEach(() => jest.clearAllMocks());

  test('onTitleClick', () => {
    const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
    expect(matches.length).toBe(1);
    TU.Simulate.click(matches[0]);
  });
});
