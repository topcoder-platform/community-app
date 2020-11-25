export class SettingsPageConstants {
  /**
   * Messages across various setting pages
   */
  public static get Messages() {
    return {
      SuccessMessage: 'Your information has been updated',
      SkillSuccessMessage: 'Success',
      LinkSuccessMessage:
        'Your link has been added. Data from your link will be visible on your profile shortly.',
      EmailPrefSuccessMessage: 'Your email preferences were updated.',
    };
  }

  /**
   * Colors constants
   */
  public static get Colors() {
    return {
      GreyColor: 'rgba(192, 192, 192, 1)',
    };
  }

  /**
   * Community constants
   */
  public static get Communities() {
    return {
      Blockchain: 'blockchain',
      Cognitive: 'cognitive',
    };
  }

  /**
   * Email Preferences
   */
  public static getEmailPreferences() {
    return [
      'Pipeline',
      'Gig Work',
      'Monthly Newsletter',
      'Marathon Match Reminders',
      'Single Round Match Reminders',
      'TCO Tuesdays',
    ];
  }
}
