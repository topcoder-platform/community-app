## Setup
1. Make sure you have a Chameleon Account and segment.com account
2. Integrate Chameleon Account with Segment. https://help.trychameleon.com/en/articles/1161770-installing-using-segment
3. Set Environment secret variable retrieved here https://app.trychameleon.com/settings/integrations/segment. Run the following command
`export CHAMELEON_VERIFICATION_SECRET=<Your Chameleon Secret>`
4. Run community app

## Verification
1. Log in to topcoder-dev account
2. Access http://local.topcoder-dev.com/challenges
3. You will notice in the network tab there will be 2 requests POST to https://api.segment.io/v1/i, one will send it to segment and one will send only to chameleon (with request payload `{ integrations: { All: false, Chameleon: true }}`)

Repeat the proses and log in to different account and make sure the `uid_hash` is different for each different user.
