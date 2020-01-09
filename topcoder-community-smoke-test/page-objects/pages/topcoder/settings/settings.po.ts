import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class SettingsPageObject {
    static get container() {
        return commonPageObjects.getTextFromH1('Settings');
    }
}