import * as config from "../../../../config.json";

export class PaymentsPageConstants {
    static get url() {
        return 'https://community.' + config.baseUrl + '/PactsMemberServlet?module=PaymentHistory&full_list=false';
    }
}