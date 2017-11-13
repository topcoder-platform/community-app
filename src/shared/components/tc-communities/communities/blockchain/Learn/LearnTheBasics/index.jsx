import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';
import Section from 'components/tc-communities/Section';
import Text from 'components/tc-communities/Text';

import style from './style.scss'

export default function LearnTheBasics() {
  return (
    <Section
      title="Learn The Basics"
      theme={{
        container: style.learnBasicsContainer,
      }}
    >
      <Accordion>
        <AccordionItem title="Joining the Blockchain Community">
          <Text>
            <p>
              Join the fastest-growing blockchain community on the world’s
              premier crowdsourcing platform. As a member, you’ll get access to
              all the tools, tutorials, and hands-on challenges you need to
              help you master blockchain. Compete in fun challenges to hone
              your skills and competitive challenges to solve real-life
              problems for businesses&nbsp;— all using today’s most in-demand
              skills and technology.
            </p>
            <JoinCommunity
              label="Join Now"
              theme={{ link: style.joinnow }}
            />
          </Text>
        </AccordionItem>
        <AccordionItem title="How to sign up for work">
          <Text>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
          </Text>
        </AccordionItem>
        <AccordionItem title="How to compete for work">
          <Text>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
          </Text>
        </AccordionItem>
        <AccordionItem title="Payment & Rewards">
          <Text>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
            <p>
              Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,
            </p>
          </Text>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}
