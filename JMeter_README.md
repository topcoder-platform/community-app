# Performance Testing for Topcoder Connect App

## Description

Topcoder Connect is a web application that makes it easy to tap into the power of crowdsourcing to get more work done faster. Connect is ideal for projects that include application design and/or development work. You can crowdsource the entire application development lifecycle or just the specific stages where you need help. Common deliverables include application wireframes, UI/UX designs, prototypes, MVPs, and production-ready apps for any kind of device—mobile, wearables, or the web.

## Dependencies

- Jmeter maven plugin 2.9.0
- Maven  3.5.2 
- JDK between 8 and 11

## Prerequisite

- We have already included the workflow into the circleci conf file with the usual dev builds.

## Directory Structure

- .circleci (Circleci configuration file)
- \src\test\jmeter - Includes the JMX file(s) and CSV data files
- pom file

### **Setup and Runtime**

Add the plugin to your project: Add the plugin to the build section of your pom's project

```
<plugin>
    <groupId>com.lazerycode.jmeter</groupId>
    <artifactId>jmeter-maven-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
        <!-- Generate JMeter configuration -->
        <execution>
            <id>configuration</id>
            <goals>
                <goal>configure</goal>
            </goals>
        </execution>
        <!-- Run JMeter tests -->
        <execution>
            <id>jmeter-tests</id>
            <goals>
                <goal>jmeter</goal>
            </goals>
        </execution>
        <!-- Fail build on errors in test -->
        <execution>
            <id>jmeter-check-results</id>
            <goals>
                <goal>results</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

This simple load test is already integrated with the current build process

```
workflows:
  version: 2
  Connect Project Services:
    jobs:
      - build:
          context : org-global
      - deployDev:
          context : org-global
          requires:
            - build
          filters:
            branches:
              only: ['develop']
      - deployProd:
          context : org-global
          requires:
            - build
          filters:
            branches:
              only: ['master']       
      - Hold [Performance-Testing]:
          type: approval
          requires:
            - build
            - deployDev
            - deployProd
      - Connect-Performance-Testing:
          requires:
            - Hold [Performance-Testing]
```

- Hold [Performance-Testing] - This is the approval job we needs manual interaction.
- It requires  `build`, `deployDev` and `deployProd` jobs to run first.
- Actual performance testing job is `Connect-Performance-Testing` and it requires `Hold [Performance-Testing]` job to finish.

### **Configuration**

<img src="https://imgur.com/0WNB89y.png" alt="">
<img src="https://imgur.com/rdP3t77.png" alt="">

This performance test is for 15 virtual users. The parameters for this test plan is as below;

- Start Thread Count
- Initial Deplay, sec (Startup Time + Hold Load For)
- Startup Time, sec (Start Thread Count = Startup Time)
- Hold Load For, sec
- Shutdown Time (Next row `Initial Deplay`)

**Formulas:**

```
Initial time of a record = initialtime + start up time/ramp-up time + holdtime of the previous record
```

```
start up time/ramp-up time = Shutdown time/ramp-down time of the previous record
```

This setup is configured to run 6min with 15 UVs.

**Token Details**

- `audience` - https://m2m.topcoder-dev.com/
- `grant_type` - client_credentials
- `content-type` - application/json
- `client_id` - jGIf2pd3f44B1jqvOai30BIKTZanYBfU
- `client_secret` - ldzqVaVEbqhwjM5KtZ79sG8djZpAVK8Z7qieVcC3vRjI4NirgcinKSBpPwk6mYYP

To extract the token we are using the variable `access_token`

TO pass the `access_token` varaible globally we are using the beanshell Assertion

`${__setProperty(access_token, ${access_token})};`

**Random Controller**

We are using Random Controller to randomize the requests sent to the server to simulate the different request.

**Think Time**

We are using this parameter to implement a random wait time in betweent the request to simulate the real user experience.

**HTTP Requets**

- Access Tabs - Simulate user accessing different tabs
- Access Projects - Simulate user accessing different projetcs
- Assets Library (Link Insert) - Add Links to the projects

## Check the reports and data

After running the job using the circleci user can view the report by clicking on the Job: `Connect-Performance-Testing` > Artifacts > `target/jmeter/reports/15UV Ultimate Thread-Group/index.html`

eg: https://2728-60865675-gh.circle-artifacts.com/0/target/jmeter/reports/15UV%20Ultimate%20Thread-Group/index.html
