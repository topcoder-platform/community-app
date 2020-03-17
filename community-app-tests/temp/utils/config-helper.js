"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../config-dev.json");
exports.ConfigHelper = {
    /**
     * Get current config
     */
    getConfig: function () {
        return config;
    },
    /**
     * Get login URL
     */
    getLoginURL: function () {
        return this.getConfig().loginUrl;
    },
    /**
     * Get homepage URL
     */
    getHomePageURL: function () {
        return this.getConfig().homePageUrl;
    },
    /**
     * Get logout URL
     */
    getLogoutURL: function () {
        return this.getConfig().logoutUrl;
    },
    /**
     * Get logout URL
     */
    getToolsURL: function () {
        return this.getConfig().toolsUrl;
    },
    /**
     * Get Username
     */
    getUserName: function () {
        return this.getConfig().username;
    },
    /**
     * Get Username
     */
    getPassword: function () {
        return this.getConfig().password;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWxzL2NvbmZpZy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBNkM7QUFFaEMsUUFBQSxZQUFZLEdBQUc7SUFDMUI7O09BRUc7SUFDSCxTQUFTO1FBQ1AsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7T0FFRztJQUNILFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDcEMsQ0FBQztJQUNEOztPQUVHO0lBQ0gsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztDQUNGLENBQUMifQ==