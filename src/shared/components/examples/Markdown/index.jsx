/**
 * Example page for <MarkdownRenderer>
 * Shows some sample markdown which inlines some JSX components and demonstrates it being rendered.
 */
import React from 'react';

import MarkdownRenderer from 'components/MarkdownRenderer';

import './style.scss';

const markdown = `### Buttons
<PrimaryButton to="http://www.topcoder.com">Primary</PrimaryButton>
<SecondaryButton to="http://www.topcoder.com">Secondary</SecondaryButton>
<Button to="http://www.topcoder.com" openNewTab>Basic w/ New Tab</Button>
### Join Community Button
<JoinCommunity label="Join The Test Community!"/>
- Note: This button will only function correctly when rendered within a TC Communities page
  (it requires the Redux store to set with community data from the page). There may also be prop warnings when rendered elsewhere.
### Link
<Link to="http://www.topcoder.com" openNewTab>Test Link w/ New Tab</Link>
### Lookers
<Looker lookerId="1146" property="copilot.handle"></Looker>
<Looker lookerId="1146" property="challenge.count" />
<Looker lookerId="1143" property="user.count" />
<Looker lookerId="1148" property="country.country_name" />
<Looker lookerId="1148" property="user.count" />
####  tables with default headers
<Looker lookerId="1143" table="" />
<Looker lookerId="1146" table="" />

#### table 1146 with custom headers
<Looker lookerId="1146" table="[{&q;headerName&q;: &q;Copilot&q;,&q;property&q;: &q;copilot.handle&q;},{&q;headerName&q;: &q;Completed challenges&q;,&q;property&q;: &q;challenge.count&q;}]" />

#### table 1148 with custom style
<Looker lookerId="1148" table="[{&q;headerName&q;: &q;Country&q;,&q;property&q;: &q;country.country_name&q;,&q;styles&q;: {&q;color&q;: &q;red&q;,&q;textAlign&q;: &q;left&q;}},{&q;headerName&q;: &q;Users Count&q;,&q;property&q;: &q;user.count&q;,&q;styles&q;: {&q;color&q;: &q;green&q;}}]" />

#### custom render function
<Looker lookerId="1146" render="function(data){return data[3][&q;copilot.handle&q;]}" />
<Looker lookerId="1148" render="function(data){return data[0][&q;user.count&q;]}" />
`;

const example = `
<MarkdownRenderer markdown={\`${markdown}\`} />
`;

const MarkdownExample = () => (
  <div styleName="container">
    <h1>
Markdown using &lt;MarkdownRenderer&gt;
    </h1>
    <h2>
Example Usage:
    </h2>
    <code>
      <pre>
        {example}
      </pre>
    </code>
    <h2>
Results:
    </h2>
    <MarkdownRenderer
      markdown={markdown}
    />
    <h2>
Currently Supported JSX Elements
    </h2>
    <ul>
      <li>
Button, PrimaryButton, SecondaryButton
      </li>
      <li>
JoinCommunity
      </li>
      <li>
Link
        <li>
Looker(property, table, and simple render function currently)
        </li>
      </li>
    </ul>
    <h2>
Notes
    </h2>
    <ul>
      <li>
  Additional JSX components can be supported by adding a
  field to customComponents in
        {' '}
        <code>
utils/markdown.js
        </code>
      </li>
      <li>
  Custom Renderer can also be called directly by importing
  the
        {' '}
        <code>
render
        </code>
        {' '}
function from
        {' '}
        <code>
utils/markdown
        </code>
      </li>
    </ul>
  </div>
);

export default MarkdownExample;
