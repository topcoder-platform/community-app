## Deployment Environments

There are total 4 deployment environments

| S | Environment  | Backend API |        Purpose        |                   URL                        |
| - | ------------ | ----------- | --------------------- | -------------------------------------------- |
| 1 | Development  | Development | feature/fixes testing | `https://community-app.topcoder-dev.com`     |
| 2 | Test         | Development | feature/fixes testing | `https://test-community-app.topcoder-dev.com`|
| 3 | Beta         | Production  | Smoke testing only    | `https://beta-community-app.topcoder.com`    |
| 4 | Production   | Production  | Main production       | `https://www.topcoder.com`                   |


## Deployment your branch on test environments

Deploy your branch on test and development envuronemnt, please do communicate before you do that as other might be using the environemnt of testing.

Got to `.circleci/config.yml` and add [your-branch] under these environemtns, please dont change anything under production worfflow.

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
      # This is beta env for production soft releases
      - "build-prod-beta":
          context : org-global
          filters:
            branches:
              only:
                - develop
      # Production builds are exectuted only on tagged commits to the
```
