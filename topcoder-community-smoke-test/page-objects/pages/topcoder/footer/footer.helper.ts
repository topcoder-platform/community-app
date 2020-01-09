import { commonPageObjects } from "../../../common/common.po";
import { browser } from "protractor";
import { ChallengeListingPageHelper } from "../challenge-listing/challenge-listing.helper";
import { FooterConstants } from "./footer.constants";
import { commonPageHelper } from "../../../common/common.helper";

export class FooterHelper {
    static async verifyFooterLinks() {
        const linksConfig = [
            {
                label: 'ABOUT US',
                expectedUrl: FooterConstants.content.aboutUrl
            },
            {
                label: 'CONTACT US',
                expectedUrl: FooterConstants.content.contactUrl
            },
            {
                label: 'HELP CENTER',
                expectedUrl: FooterConstants.content.helpUrl
            },
            {
                label: 'PRIVACY POLICY',
                expectedUrl: FooterConstants.content.privacyUrl
            },
            {
                label: 'TERMS',
                expectedUrl: FooterConstants.content.termsUrl
            }
        ];
        for (let i = 0; i < linksConfig.length; i++) {
            const linkConfig = linksConfig[i];
            await this.verifyLink(linkConfig.label, linkConfig.expectedUrl);
            await ChallengeListingPageHelper.get();
        }
    }

    static async verifyLink(label: string, expectedUrl: string) {
        await commonPageObjects.findElementByText('a', label).click();
        await browser.wait(async () => {
            const url = await browser.getCurrentUrl();
            return url === expectedUrl;
        });
    }

    static async verifySocialIcons() {
        const linksConfig = [
            {
                label: 'Facebook',
                expectedUrl: FooterConstants.content.fbUrl
            },
            {
                label: 'Twitter',
                expectedUrl: FooterConstants.content.twitterUrl
            },
            {
                label: 'Linkedin',
                expectedUrl: FooterConstants.content.linkedInUrl
            },
            {
                label: 'Instagram',
                expectedUrl: FooterConstants.content.instagramUrl
            }
        ];
        for (let i = 0; i < linksConfig.length; i++) {
            const linkConfig = linksConfig[i];
            await this.verifySocialLink(linkConfig.label, linkConfig.expectedUrl);
        }
    }

    static async verifySocialLink(label: string, expectedUrl: string) {
        await commonPageObjects.getLinkByAriaLabel(label).click();
        if (label === 'Linkedin') {
            // specifically checking differently for linkedin since Linkedin url doesn't always land on the topcoder profile page as it detects that Selenium web-driver is running and hence  shows some verification page
            await commonPageHelper.verifyPopupWindow();
        } else {
            await commonPageHelper.verifyPopupWindowWithUrl(expectedUrl);
        }
    }
}