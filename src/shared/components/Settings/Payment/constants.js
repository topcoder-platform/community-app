export const PAYMENT_PROVIDER = 'payment_provider';

/**
 * List of payment methods supported
 */
export const PAYMENT_METHODS = [
  {
    name: 'payoneer',
    fees: 'Check with Payoneer directly for current transaction, conversion or bank fees.',
    countries: 150,
    speed: 1,
  },
  {
    name: 'paypal',
    fees: 'Check with PayPal directly for current transaction, conversion or bank fees.',
    countries: 200,
    speed: 1,
  },
  {
    name: 'western-union',
    fees: 'Check with WesternUnion directly for current transaction, conversion or bank fees.',
    countries: 200,
    speed: 3,
  },
];

/**
 * Map of payment method to the display name
 */
export const PAYMENT_METHOD_MAP = {
  payoneer: 'Payoneer',
  paypal: 'PayPal',
  'western-union': 'Western Union',
};

/**
 * The payment method details map
 */
export const PAYMENT_METHOD_DETAILS_MAP = {
  payoneer: {
    instructions: [
      {
        label:
          "Email <a href='mailto: support@topcoder.com'>support@topcoder.com</a>",
      },
      {
        label: 'Subject Line: Topcoder Payment Provider',
      },
      {
        label: 'In the email include:',
        children: [
          'Topcoder handle (your username when registering)',
          'Payoneer Customer ID',
          'Payoneer Email Address',
        ],
      },
    ],
    conditions: `
      <p>You can elect to receive payments through Payoneer either to your Payoneer prepaid MasterCard or by using their Global Bank Transfer service. The Payoneer Bank Transfer Service offers a local bank transfer option (where available) and a wire transfer option. Certain fees may apply.</p>
    `,
    important:
      'Important: After you create an account, please email support@topcoder.com with the information outlined',
    url: 'https://www.payoneer.com',
  },
  paypal: {
    instructions: [
      {
        label:
          "Email <a href='mailto: support@topcoder.com'>support@topcoder.com</a>",
      },
      {
        label: 'Subject Line: Topcoder Payment Provider',
      },
      {
        label: 'In the email include:',
        children: [
          'Topcoder handle (your username when registering)',
          'PayPal Email Address',
        ],
      },
      {
        label:
          'Please DO NOT provide a link to your PayPal account. We only need your PayPal email address.',
      },
    ],
    conditions: `
      <p>You can elect to receive payments deposited directly to your PayPal account. Certain fees may apply.</p>
    `,
    important:
      'Important: After you create an account, please email support@topcoder.com with the information outlined',
    url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_registration-run',
  },
  'western-union': {
    instructions: [
      {
        label:
          "Email <a href='mailto: support@topcoder.com'>support@topcoder.com</a>",
      },
      {
        label: 'Subject Line: Topcoder Payment Provider',
      },
      {
        label: 'In the email include:',
        children: [
          'Topcoder handle (your username when registering)',
          'Topcoder Email Address (the email address you used to register)',
        ],
      },
    ],
    conditions: `
      <p>You can elect to be paid via wire transfer through Western Union. There is a US $8 charge for each payment processed by Western Union, which will be deducted from the amount owed to you. You can elect to be paid in either USD or your local currency. However, Western Union does not disclose it’s fees to convert to your local currency so we recommend you choose to receive USD. You may then be subject to conversion fees by your local bank.</p>
      <p><strong>Important:</strong> Use your Topcoder handle as the Payee ID during registration. Use the Preferred Form of Payment as “Fastest,” rather than “Least Cost.” “Least Cost” uses ACH as a form of payment, which is not supported in all countries.</p>
      <p>If you elect to be paid by Western Union, your payment request will be queued and processed semi-monthly, on the 15th and last business day of the month. If the 15th or last day of the month falls on a weekend or holiday, Western Union payments will be processed the next business day.</p>
      <p>In order to be included in the semi-monthly payments, you need to select which payments you would like to be paid for by 10:00 AM EST on the day of the scheduled payment.</p>
    `,
    important:
      'Important: After you create an account, please return to this screen and enter the appropriate account details.',
    url:
      'https://payee.globalpay.westernunion.com/PayeeManager/BeneficiaryEnrollment/SpecifyPayeeID.aspx?id=9E63C90B520F830246DA2FD728CDAEBF',
  },
};

export default undefined;
