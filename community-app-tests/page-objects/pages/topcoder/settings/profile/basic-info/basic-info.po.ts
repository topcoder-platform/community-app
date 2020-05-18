import { logger } from "../../../../../../logger/logger";
import { BrowserHelper, ElementHelper } from "topcoder-testing-lib";
import { SettingsPage } from "../../settings.po";
import { TcElementImpl } from "topcoder-testing-lib/dist/src/tc-element-impl";
import { ConfigHelper } from "../../../../../../utils/config-helper";

export class BasicInfoPage extends SettingsPage {
  public static selectedDate;

  /**
   * Gets the BasicInfo page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getProfileUrl());
    this.switchTab("basic info");
    logger.info("User navigated to BasicInfo Page");
  }

  /**
   * Gets the first name field
   */
  public get firstName() {
    return ElementHelper.getElementById("firstName");
  }

  /**
   * Gets the last name field
   */
  public get lastName() {
    return ElementHelper.getElementById("lastName");
  }

  /**
   * Gets the dob field
   */
  public get dob() {
    return ElementHelper.getElementById("date-range-picker1");
  }

  /**
   * Gets the current date from datepicker
   */
  public get currentDate() {
    return ElementHelper.getElementByClassName("CalendarDay__selected");
  }

  /**
   * Gets the address1 field
   */
  public get address1() {
    return ElementHelper.getElementByName("streetAddr1");
  }

  /**
   * Gets the address2 field
   */
  public get address2() {
    return ElementHelper.getElementByName("streetAddr2");
  }

  /**
   * Gets the city field
   */
  public get city() {
    return ElementHelper.getElementById("city");
  }

  /**
   * Gets the state field
   */
  public get state() {
    return ElementHelper.getElementById("state");
  }

  /**
   * Gets the zip field
   */
  public get zip() {
    return ElementHelper.getElementById("zipCode");
  }

  private get leftDatePickNavButton() {
    return ElementHelper.getElementByClassName(
      "DayPickerNavigation_button__horizontal"
    );
  }

  /**
   * Get link basis aria label
   * @param label
   */
  public getLinkByAriaLabel(label: string) {
    return ElementHelper.getElementByCss('[aria-label="' + label + '"]');
  }

  /**
   * Get country input field
   */
  public get countryInput() {
    return ElementHelper.getElementByCss(
      '[aria-activedescendant="react-select-2--value"]'
    );
  }

  /**
   * Gets gender input field
   */
  public get genderInput() {
    return ElementHelper.getElementByCss(
      '[aria-activedescendant="react-select-3--value"]'
    );
  }

  /**
   * Gets the tshirt size input field
   */
  public get sizeInput() {
    return ElementHelper.getElementByCss(
      '[aria-activedescendant="react-select-4--value"]'
    );
  }

  /**
   * Gets the gender hidden field
   */
  public get genderHidden() {
    return ElementHelper.getElementByName("gender");
  }

  /**
   * Gets the tshirt size hidden field
   */
  public get tshirtSizeHidden() {
    return ElementHelper.getElementByName("tshirtSize");
  }

  /**
   * Gets the current location field
   */
  public get currentLocation() {
    return ElementHelper.getElementById("currentLocation");
  }

  /**
   * Gets the primary interest field
   */
  public get primaryInterestInTopcoder() {
    return ElementHelper.getElementById("primaryInterestInTopcoder");
  }

  /**
   * Gets the description field
   */
  public get description() {
    return ElementHelper.getElementById("description");
  }

  private get saveButton() {
    return ElementHelper.getTagElementMatchingText("button", "Save Changes");
  }

  /**
   * Gets the tracks which are disabled
   */
  public async getTrackSwitchesDisabled() {
    const elements = await ElementHelper.getAllElementsByClassName("BZhTou");
    const values = [];
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const val = await ElementHelper.getElementByClassName(
        "onoffswitch-checkbox",
        el
      ).element.getAttribute("value");
      values.push(val);
    }
    return values;
  }

  /**
   * Gets all the track switches
   */
  private async getTrackSwitches() {
    return ElementHelper.getAllElementsByClassName("onoffswitch-switch");
  }

  /**
   * Gets the first date which can be selected and is enabled
   */
  private async getFirstSelectableDate() {
    const els: TcElementImpl[] = await ElementHelper.getAllElementsByClassName(
      "CalendarDay__default"
    );
    let label = "";
    for (let i = 0; i < els.length; i++) {
      const isDisplayed = await els[i].isDisplayed();
      if (isDisplayed) {
        label = await els[i].element.getAttribute("aria-label");
        return label;
      }
    }
  }

  /**
   * Fills the personal details
   */
  public async fillPersonalDetails(personalDetails) {
    BrowserHelper.sleep(1000);
    await this.firstName.clear();
    await this.firstName.sendKeys(personalDetails.firstName);

    await this.lastName.clear();
    await this.lastName.sendKeys(personalDetails.lastName);

    await this.dob.click();

    let firstSelectableLabel = await this.getFirstSelectableDate();
    const today = new Date();
    const formatted = this.getDate(today);

    // today's date is the first selectable date, so move back
    if (formatted === firstSelectableLabel) {
      await this.leftDatePickNavButton.click();
      await BrowserHelper.sleep(1000);

      firstSelectableLabel = await this.getFirstSelectableDate();

      await this.getLinkByAriaLabel(firstSelectableLabel).click();
    } else {
      await this.getLinkByAriaLabel(firstSelectableLabel).click();
    }

    BasicInfoPage.selectedDate = await this.dob.getAttribute("value");

    await this.address1.clear();
    await this.address1.sendKeys(personalDetails.address1);

    await this.address2.clear();
    await this.address2.sendKeys(personalDetails.address2);

    await this.city.clear();
    await this.city.sendKeys(personalDetails.city);

    await this.state.clear();
    await this.state.sendKeys(personalDetails.state);

    await this.zip.clear();
    await this.zip.sendKeys(personalDetails.zip);

    await this.performSelection(this.countryInput, personalDetails.country);
  }

  /**
   * Fills about-you section
   */
  public async fillAboutYou(aboutYou) {
    await this.performSelection(this.genderInput, aboutYou.gender);
    await this.performSelection(this.sizeInput, aboutYou.tshirtSize);

    await this.currentLocation.clear();
    await this.currentLocation.sendKeys(aboutYou.currentLocation);

    await this.primaryInterestInTopcoder.clear();
    await this.primaryInterestInTopcoder.sendKeys(aboutYou.primaryInterest);

    await this.description.clear();
    await this.description.sendKeys(aboutYou.description);
  }

  /**
   * Fills the track details section
   */
  public async fillTrackDetails(tracks) {
    const disabledTracks = await this.getTrackSwitchesDisabled();
    const switches = await this.getTrackSwitches();

    if (
      (disabledTracks.includes("design") && tracks.design) ||
      (!disabledTracks.includes("design") && !tracks.design)
    ) {
      await switches[0].click();
    }
    if (
      (disabledTracks.includes("develop") && tracks.develop) ||
      (!disabledTracks.includes("develop") && !tracks.develop)
    ) {
      await switches[1].click();
    }
    if (
      (disabledTracks.includes("data_science") && tracks.dataScience) ||
      (!disabledTracks.includes("data_science") && !tracks.dataScience)
    ) {
      await switches[2].click();
    }
  }

  /**
   * Saves the changes filled in
   */
  public async saveChanges() {
    await this.saveButton.click();
    await this.waitForSuccessMsg();
  }

  private getDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
}
