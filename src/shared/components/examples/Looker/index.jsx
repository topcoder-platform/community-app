import React from 'react';
import Looker from 'containers/Looker';

export default function Buttons() {
  return (
    <div>
      <h1>Demonstrate usage and preview of Looker component </h1>
      <hr />
      <pre>{'<Looker lookerId="1146" property="copilot.handle" />'}</pre>
      <br />
      <Looker lookerId="1146" property="copilot.handle" />
      <hr />
      <pre>{'<Looker lookerId="1146" property="challenge.count" />'}</pre>
      <br />
      <Looker lookerId="1146" property="challenge.count" />
      <hr />
      <pre>{'<Looker lookerId="1143" property="user.count" />'}</pre>
      <br />
      <Looker lookerId="1143" property="user.count" />
      <hr />
      <pre>{'<Looker lookerId="1148" property="country.country_name" />'}</pre>
      <br />
      <Looker lookerId="1148" property="country.country_name" />
      <hr />
      <pre>{'<Looker lookerId="1148" property="user.count" />'}</pre>
      <br />
      <Looker lookerId="1148" property="user.count" />
      <hr />
      <pre>{`
      Do not show header when headerName not provided, countRows is 'true', and limit of 10 records

      <Looker
        lookerId="1146"
        limit="10"
        countRows="true"
        table={[
            {
              property: "copilot.handle",
           },
           {
              headerName: "Completed challenges",
              property: "challenge.count"
           }
          ]}
      />
       `}
      </pre>
      <Looker
        lookerId="1146"
        limit="10"
        countRows="true"
        table={[
          {
            property: 'copilot.handle',
          },
          {
            headerName: 'Completed challenges',
            property: 'challenge.count',
          },
        ]}
      />
      <hr />
      <pre>{`
        Table having list without &q;

        <Looker lookerId="1146" table='[{"headerName": "Copilot","property": "copilot.handle"},{"headerName": "Completed challenges","property": "challenge.count"}]' />
       `}
      </pre>
      <Looker lookerId="1146" table='[{"headerName": "Copilot","property": "copilot.handle"},{"headerName": "Completed challenges","property": "challenge.count"}]' />
      <hr />
      <pre>{`
        <Looker lookerId="1146" table="[{&q;headerName&q;: &q;Copilot&q;,&q;property&q;: &q;copilot.handle&q;},{&q;headerName&q;: &q;Completed challenges&q;,&q;property&q;: &q;challenge.count&q;}]" />
       `}
      </pre>
      <Looker lookerId="1146" table="[{&q;headerName&q;: &q;Copilot&q;,&q;property&q;: &q;copilot.handle&q;},{&q;headerName&q;: &q;Completed challenges&q;,&q;property&q;: &q;challenge.count&q;}]" />
      <hr />
      <pre>{`
      <Looker
        lookerId="1146"
        table={[
            {
              headerName: "Copilot",
              property: "copilot.handle",
              styles: {
                color: "red",
                textAlign: "left"
              }
           },
           {
              headerName: "Completed challenges",
              property: "challenge.count"
           }
          ]}
      />
       `}
      </pre>
      <Looker
        lookerId="1146"
        table={[
          {
            headerName: 'Copilot',
            property: 'copilot.handle',
            styles: {
              color: 'red',
              textAlign: 'left',
            },
          },
          {
            headerName: 'Completed challenges',
            property: 'challenge.count',
          },
        ]}
      />
      <hr />
      <pre>{`
            <Looker lookerId="1148" table="[{&q;headerName&q;: &q;Country&q;,&q;property&q;: &q;country.country_name&q;,&q;styles&q;: {&q;color&q;: &q;red&q;,&q;textAlign&q;: &q;left&q;}},{&q;headerName&q;: &q;Users Count&q;,&q;property&q;: &q;user.count&q;,&q;styles&q;: {&q;color&q;: &q;green&q;}}]" />
       `}
      </pre>
      <Looker lookerId="1148" table="[{&q;headerName&q;: &q;Country&q;,&q;property&q;: &q;country.country_name&q;,&q;styles&q;: {&q;color&q;: &q;red&q;,&q;textAlign&q;: &q;left&q;}},{&q;headerName&q;: &q;Users Count&q;,&q;property&q;: &q;user.count&q;,&q;styles&q;: {&q;color&q;: &q;green&q;}}]" />
      <hr />
      <pre>{'<Looker lookerId="1148" table="" />'}</pre>
      <br />
      <Looker lookerId="1148" table="" />
      <hr />
      <pre>{`
        <Looker
          lookerId="1146"
          render={(data) => {return data[3]["copilot.handle"]}}
        ></Looker>
      `}
      </pre>
      <Looker
        lookerId="1146"
        render={data => data[3]['copilot.handle']}
      />
      <hr />
      <pre>{`
        <Looker lookerId="1148" render="function(data){return data[0][&q;user.count&q;]}" />
      `}
      </pre>
      <Looker lookerId="1148" render="function(data){return data[0][&q;user.count&q;]}" />
      <hr />
      <pre>{'<Looker lookerId="1146sdfsd" property="copilot.handle" />'}</pre>
      <br />
      <Looker lookerId="1146sdfsd" property="copilot.handle" />
      <hr />
    </div>
  );
}
