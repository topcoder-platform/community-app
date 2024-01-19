## Deployment Environments

There are total 4 deployment environments

| # | Environment  | Backend API |        Purpose           |                   URL                        |
| - | ------------ | ----------- | ------------------------ | -------------------------------------------- |
| 1 | Development  | Development | feature/fixes testing    | `https://community-app.topcoder-dev.com`     |
| 2 | Test         | Development | feature/fixes testing    | `https://test-community-app.topcoder-dev.com`|
| 3 | QA           | Development | Smoke/regression testing | `https://qa-community-app.topcoder-dev.com`  |
| 5 | Production   | Production  | Main production          | `https://www.topcoder.com`                   |


## Deploy your branch on test environments

Deploy your branch on test and development environements by making following changes. 

1. Please do communicate on slack (#community-app channel) before you do that as other might be using the environemnt of testing.
2. Checkout the intended branch
3. Got to `.circleci/config.yml` and add [your-branch] under desired environement, please dont change anything under production workflow. Add branch to only one workflow.

```
workflows:
  version: 2
  build:
    jobs:
      # Development builds are executed on "new-develop" branch only.
      - "build-dev":
          context : org-global
          filters:
            branches:
              only: 
                - develop
                - [your-branch]
        # This is alternate dev env for parallel testing
      - "build-test":
          context : org-global      
          filters:
            branches:
              only:
                - develop
```
4. Commit the changes
5. Status of the deployment environments can be checked here https://cci-reporter.herokuapp.com/
