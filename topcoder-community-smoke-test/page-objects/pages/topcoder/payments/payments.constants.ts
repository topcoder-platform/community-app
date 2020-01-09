import { commonPageHelper } from "../../../common/common.helper";

export class PaymentsPageConstants {
    static get url() {
        return 'https://community.' + commonPageHelper.getConfig().baseUrl + '/PactsMemberServlet?module=PaymentHistory&full_list=false';
    }
}