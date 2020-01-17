## Code Phase

1. Co-pilot will prepare and launch a ticket
	i.   Add Prize in the issue title [$SOMEAMOUT]
	ii.  Mention PR branch, this branch should be always in sync with master
	iii. Change label to `tcx_OpenForPickup`
	iv.  Tag the community @topcoder-platform/tcxcommunity @topcoder-platform/topcodercompetitors 	
2. A competitor takes a ticket (`tcx_Assigned`), writes code
3. Competitor PR to the branch (submission) and they should change the label to `tcx_ReadyForReview`

## Review Phase

4. Co-pilot will review the code 
	i.   `Code Review Passed` 
	ii.  `Code Review Failed` - go to 1.iii or 4.iii
	iii. `tcx_Feedback`

## QA Deployment Phase
	
5. Based on the label `Code Review Passed`, the architect will merge PRs and deploy code based on whatever environment is available. 
6. Once deployed on the environment label should be changed to `Ready for QA` and let QA team inform on #community-app slack channel.
7. Based on QA feedback `QA Pass`/`QA Fail`
8. If 7 pass co-pilot will create PR to `fix-branch > develop` branch
9. An architect will merge PR and ask for smoke testing
10. If smoke testing goes well, co-pilot create PR to `develop > master` 

