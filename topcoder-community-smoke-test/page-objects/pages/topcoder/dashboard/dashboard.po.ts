import { element, by } from "protractor";
import { commonPageObjects } from "../../../common/common.po";

export class DashboardPageObject {
    static get container() {
        return commonPageObjects.getTextFromH1('Dashboard');
    }
}