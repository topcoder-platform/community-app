###
- Video - https://www.youtube.com/watch?v=TJS-OuQ8LXQ
- Note: Apply patch against b5a2105f471bab8b8de2efddb24225e3d9308b0b

### Testing
1. Run the dev server. ```npm run dev```
2. Goto ```http://local.topcoder-dev.com:3000/challenges/30050440/submit/file```. This is the submission page that will be shown to develop challengers.
3. ```http://local.topcoder-dev.com:3000/challenges/30050696/submit/file``` for design challenge.
4. Note: for testing submission flow, tokenV2 is required. It wouldn't work on localhost:3000, make sure to type the url as shown above, and also to change your ```etc/hosts``` file as mentioned in README.md file.
5. As of now, the submission flow for design challenge is not tested as confirmed in forum. Both submission/error flow for develop challenges is done. Error flow for design challenge is shown in the video.

### Note on Design Submission
1. Currently, submissions to develop challenges are handled via api V2. This is properly handled by services written in this challenge. The case with Design challenges is unknown. See thread - https://apps.topcoder.com/forums/?module=Thread&threadID=906164&start=0. Basically, once we have info about how design submissions are handled, we will need to replace the current service that handles design challenge.