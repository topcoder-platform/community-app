import { browser } from "protractor";
import { LoginPageHelper } from "../page-objects/pages/topcoder/login/login.helper";
import { ProfilePageHelper } from "../page-objects/pages/topcoder/profile/profile.helper";
import { commonPageHelper } from "../page-objects/common/common.helper";
import { HeaderHelper } from "../page-objects/pages/topcoder/header/header.helper";
import { HomePageHelper } from "../page-objects/pages/topcoder/home/home.helper";
import { ChallengeListingPageHelper } from "../page-objects/pages/topcoder/challenge-listing/challenge-listing.helper";

describe('Topcoder Profile Page Tests: ', () => {
    beforeAll(async () => {
        await browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = false;

        await LoginPageHelper.get();
        await LoginPageHelper.waitForLoginForm();
        await LoginPageHelper.fillLoginForm(false);
        await LoginPageHelper.waitForLoginSuccessWithoutLoggingOut();
    });

    afterAll(async () => {
        try {
            await ChallengeListingPageHelper.get();
            await HeaderHelper.clickOnLogoutLink();
            await HomePageHelper.verifyHomePage();
        } catch (e) {
            await browser.restart();
        }
    });

    it('should verify whether the current user can update basic information.', async () => {
        await ProfilePageHelper.get();
        await ProfilePageHelper.fillPersonalDetails();
        await ProfilePageHelper.fillAboutYou();
        await ProfilePageHelper.fillTrackDetails();
        await ProfilePageHelper.saveChanges();
        await ProfilePageHelper.get();
        await ProfilePageHelper.verifyPersonalDetails();
        await ProfilePageHelper.verifyAboutYou();
        await ProfilePageHelper.verifyTrackDetails();
    });

    it('should verify User can Add/Update/Delete language', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('language', 'Language');
        await ProfilePageHelper.addLanguage();
        await ProfilePageHelper.editLanguage();
        await ProfilePageHelper.deleteLanguage();
    });

    it('should verify User can Add/Update/Delete Education', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('education', 'Education');
        await ProfilePageHelper.addEducation();
        await ProfilePageHelper.editEducation();
        await ProfilePageHelper.deleteEducation();
    });

    it('should verify User can Add/Update/Delete work ', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('work', 'Work');
        await ProfilePageHelper.addWork();
        await ProfilePageHelper.editWork();
        await ProfilePageHelper.deleteWork();
    });

    it('should verify User can Add/Delete skill.', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('skills', 'Skill');
        await ProfilePageHelper.addSkill();
        await ProfilePageHelper.deleteSkill();
    });

    it('should verify User can Add/Update/Delete the hobby.', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('hobbies', 'Hobby');
        await ProfilePageHelper.addHobby();
        await ProfilePageHelper.editHobby();
        await ProfilePageHelper.deleteHobby();
    });

    it('should verify User can update the community.', async () => {
        await ProfilePageHelper.get();
        await commonPageHelper.switchTab('communities', 'Community');
        await ProfilePageHelper.verifyBlockchainCommunity();
    });
});