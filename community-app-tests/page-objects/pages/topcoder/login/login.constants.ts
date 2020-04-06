export class LoginPageConstants {
  /**
   * Error messages
   */
  static get errors() {
    return {
      InvalidPassword:
        "That password is incorrect. Please check that you entered the right one.",
      MemberNotPresent:
        "We couldn't find a member with that username. Please check that you entered it correctly.",
    };
  }
}
