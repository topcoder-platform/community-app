import { logger } from "../../../../../../logger/logger";
import { BasicInfoPage } from "./basic-info.po";

export class BasicInfoPageHelper {
  /**
   * gets the Basic Info page object
   */
  public static setBasicInfoPage(basicInfoPage) {
    this.basicInfoPageObject = basicInfoPage;
  }

  /**
   * Opens the my account page in the browser
   */
  public static async open() {
    this.basicInfoPageObject = new BasicInfoPage();
    await this.basicInfoPageObject.open();
  }

  /**
   * Verify basic Info Update
   * @param basicInfo - object representation of Basic Information
   */
  public static async verifyBasicInfoUpdate(basicInfo) {
    await this.basicInfoPageObject.fillPersonalDetails(
      basicInfo.personalDetails
    );
    logger.info("Filled Personal Details section");
    await this.basicInfoPageObject.fillAboutYou(basicInfo.aboutYou);
    logger.info("Filled about you section");
    await this.basicInfoPageObject.fillTrackDetails(basicInfo.tracks);
    logger.info("Filled Track Details section");
    await this.basicInfoPageObject.saveChanges();
    await this.open();
    await this.verifyPersonalDetails(basicInfo.personalDetails);
    await this.verifyAboutYou(basicInfo.aboutYou);
    await this.verifyTrackDetails(basicInfo.tracks);
  }

  /**
   * Verify personal details section details
   * @param personalDetails - object representation of personal details
   */
  public static async verifyPersonalDetails(personalDetails) {
    await this.basicInfoPageObject.fillPersonalDetails(personalDetails);

    const firstName = await this.basicInfoPageObject.firstName.element.getAttribute(
      "value"
    );
    expect(firstName).toEqual(personalDetails.firstName);

    const lastName = await this.basicInfoPageObject.lastName.element.getAttribute(
      "value"
    );
    expect(lastName).toEqual(personalDetails.lastName);

    const dob = await this.basicInfoPageObject.dob.element.getAttribute(
      "value"
    );
    expect(dob).toEqual(BasicInfoPage.selectedDate);

    const address1 = await this.basicInfoPageObject.address1.element.getAttribute(
      "value"
    );
    expect(address1).toEqual(personalDetails.address1);

    const address2 = await this.basicInfoPageObject.address2.element.getAttribute(
      "value"
    );
    expect(address2).toEqual(personalDetails.address2);

    const city = await this.basicInfoPageObject.city.element.getAttribute(
      "value"
    );
    expect(city).toEqual(personalDetails.city);

    const state = await this.basicInfoPageObject.state.element.getAttribute(
      "value"
    );
    expect(state).toEqual(personalDetails.state);

    const zip = await this.basicInfoPageObject.zip.element.getAttribute(
      "value"
    );
    expect(zip).toEqual(personalDetails.zip);
  }

  /**
   * Verify about you section details
   * @param aboutYou - object representation of aboutYou
   */
  public static async verifyAboutYou(aboutYou) {
    const gender = await this.basicInfoPageObject.genderHidden.element.getAttribute(
      "value"
    );
    expect(gender).toEqual(aboutYou.gender);

    const tshirtSize = await this.basicInfoPageObject.tshirtSizeHidden.element.getAttribute(
      "value"
    );
    expect(tshirtSize).toEqual(aboutYou.tshirtSize);

    const currentLocation = await this.basicInfoPageObject.currentLocation.element.getAttribute(
      "value"
    );
    expect(currentLocation).toEqual(aboutYou.currentLocation);

    const primaryInterestInTopcoder = await this.basicInfoPageObject.primaryInterestInTopcoder.element.getAttribute(
      "value"
    );
    expect(primaryInterestInTopcoder).toEqual(aboutYou.primaryInterest);

    const description = await this.basicInfoPageObject.description.element.getAttribute(
      "value"
    );
    expect(description).toEqual(aboutYou.description);
  }

  /**
   * Verify track details
   * @param tracks - object representation of tracks
   */
  public static async verifyTrackDetails(tracks) {
    const disabledTracks = await this.basicInfoPageObject.getTrackSwitchesDisabled();
    if (!tracks.design) {
      expect(disabledTracks.includes("design")).toBe(true);
    } else {
      expect(disabledTracks.includes("design")).toBe(false);
    }
    if (!tracks.develop) {
      expect(disabledTracks.includes("develop")).toBe(true);
    } else {
      expect(disabledTracks.includes("develop")).toBe(false);
    }
    if (!tracks.dataScience) {
      expect(disabledTracks.includes("data_science")).toBe(true);
    } else {
      expect(disabledTracks.includes("data_science")).toBe(false);
    }
  }

  private static basicInfoPageObject: BasicInfoPage;
}
