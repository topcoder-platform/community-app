
This document describes the Topcoder issue/feature release process using TCX. This is a guide for co-pilots, QA, architects and community members. Co-pilot is the driver of the whole process from opening a ticket to the deployment.

## Code Phase

1. Create a branch from the `master` and name it as `hot-fix-fixtitle` or `feature-featuretitle`
2. Co-pilot will prepare and launch a ticket    

    a.  Add Prize in the issue title [$SOMEAMOUT]
    
    b.  Mention PR branch, this branch should be always in sync with master or newly created as mentioned in 1
    
    c. Add this to instruction that all the PR should pass `npm test`
    
    d.  Change label to `tcx_OpenForPickup`
    
    e. Tag the community @topcoder-platform/tcxcommunity @topcoder-platform/topcodercompetitors     
3. A competitor assings a ticket to self (`tcx_Assigned`), writes the code for the fix
4. Competitor, PR to the branch (submission) and they should change the label to `tcx_ReadyForReview`

## Review Phase

 4. Co-pilot will review the code, based on review change the label to
 
     a. `tcx_Feedback` - Feedback should be mentioned in the comments section, this may lead to asking for patch PR
     
     b. `Code Review Passed` and `tcx_FixAccepted`- This goes to QA Deployment Phase
     
     c. `Code Review Failed` - This goes to 1
    
## QA Deployment Phase
    
5. Based on the label `Code Review Passed`, co-pilot should request deployment to the architect. Based on whatever testing deployment environment is available to code will be deployed.  

6. Once deployed on the environment co-pilot will change the label to `Ready for QA` and will inform the QA team on #community-app slack channel.

7. Based on QA feedback label should be `QA Pass` or `QA Fail`

8. `QA Fail` label will go to **Review Phase** again

9. `QA Pass` label is a candidate for production deployment 

10. Co-pilot will create PR to `fix-branch > develop` branch

11. An architect will merge PR and ask for smoke testing to the QA team 

12. If smoke testing goes well, co-pilot create PR to `develop > master` 

13. It takes around 20 mins for deployment on any deployment.

14. QA team will verify the post-production issue fix.

15. If post-production test passes QA team will change the label to `Prod QA Pass`, Co-pilot will close this ticket

17. If post-production test fails QA team will change the label to `Prod QA Failed`

