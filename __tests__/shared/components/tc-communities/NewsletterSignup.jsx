import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <NewsletterSignup
      title="Sign up for our newsletter"
      text="Don’t miss out on the latest Topcoder IOS challenges and information!"
      imageSrc="/themes/wipro2/subscribe-bg.jpg"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <NewsletterSignup
      title="Sign up for our newsletter"
      text="Don’t miss out on the latest Topcoder IOS challenges and information!"
      imageSrc="/themes/wipro2/subscribe-bg.jpg"
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
