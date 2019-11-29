"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../../../../config.json");
var SearchPageConstants = /** @class */ (function () {
    function SearchPageConstants() {
    }
    SearchPageConstants.getUrl = function (query) {
        return 'https://www.' + config.baseUrl + '/search/members/?q=' + query;
    };
    return SearchPageConstants;
}());
exports.SearchPageConstants = SearchPageConstants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhZ2Utb2JqZWN0cy9wYWdlcy90b3Bjb2Rlci9zZWFyY2gvc2VhcmNoLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFrRDtBQUVsRDtJQUFBO0lBSUEsQ0FBQztJQUhVLDBCQUFNLEdBQWIsVUFBYyxLQUFhO1FBQ3ZCLE9BQU8sY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcscUJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBQzNFLENBQUM7SUFDTCwwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksa0RBQW1CIn0=