export const PAYMENT_PROVIDER = 'payment_provider';

/**
 * List of payment methods supported
 */
export const PAYMENT_METHODS = [
  {
    name: 'payoneer',
    fees: '$0–$3 + Currency Conversion Rates May Apply',
    countries: 150,
    speed: 1,
  },
  {
    name: 'paypal',
    fees: '3.49% + an international fee (non US) + a fixed fee depending upon currency',
    countries: 200,
    speed: 1,
  },
  {
    name: 'western-union',
    fees: '$8 per transaction (your bank may charge additional fees)',
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

export const TAX_PROVIDER = 'tax_provider';

export const TAX_FORM = [
  {
    name: 'w-9',
  },
  {
    name: 'w-8ben',
  },
];

export const TAX_FORM_MAP = {
  'w-9': 'W-9',
  'w-8ben': 'W-8BEN',
};

/**
 * The tax form details based on the form names
 */
export const FORM_DETAILS = {
  'w-9': {
    description:
      'For individuals who are a US citizen or other US person (such as a resident alien). ',
    answer:
      'Topcoder must receive your correctly completed W-9 to report to the IRS income paid to you. Topcoder’s policy is not to issue payments to US members until a properly completed Form W-9 is received from the member.',
    instructions:
      'http://www.irs.gov/pub/irs-pdf/iw9.pdf',
    formUrl:
      'https://community.topcoder.com/tc?module=SignDocument&templateId=2BA08E97-5707-4D6B-AFD3-27635B53D13A',
  },
  'w-8ben': {
    description: `
      <p>For individuals who are NOT a US citizen or other US person.</p>
      <p>Fill out Form W-8BEN if you are a foreign person, non-resident alien, or foreign national.</p>
    `,
    answer:
      'Under current IRS guidance, foreign persons performing services outside of the U.S. are not subject to income tax withholding. However, Topcoder requires all such members to provide a properly filled out W-8BEN prior to issuing payment. In addition, prize money paid to foreign persons who are not performing services (such as winning an SRM competition) is subject to withholding taxes.',
    instructions:
      'http://www.irs.gov/pub/irs-pdf/iw8.pdf',
    infoLabel: 'See Topcoder Tax Information for Form W-8BEN for details',
    extraDetails: `
      <p>
        The W-8BEN is required to: 
        <ul>
          <li>Establish that you are not a U.S. person </li>
          <li>Claim that you are the beneficial owner of the income for which Form W-8BEN is being provided. </li>
        </ul>
      </p>
      <p>
        Topcoder’s policy is not to issue payments to foreign members until a properly completed Form W-8BEN is received from the member.
      </p>
    `,
    formUrl:
      'https://community.topcoder.com/tc?module=SignDocument&templateId=4640A329-F4D2-4D64-BAAF-C2F8A5C20289',
  },
};

/**
 * This is the content for the W-8BEN tax form
 */
export const TAX_INFO_CONTENT = `
  <h3>WHO MAY BE ELIGIBLE TO CLAIM TAX TREATY BENEFITS UNDER FORM W-8BEN?</h3>
  <span>
    Individuals meeting both of the following conditions:
    <ul>
      <li>You are NOT a US citizen or other US person (such as a resident alien)</li>
      <li>You did not perform services *</li>
    </ul>
  </span>

  <h3>WHAT IS THE POTENTIAL BENEFIT OF CLAIMING TAX TREATY BENEFITS UNDER FORM W-8BEN?</h3>
  <span>If you are a foreign person, non-resident alien or foreign national who is not performing services*, Topcoder will withhold taxes on the payment. You may claim exemption from or reduction of the rate that will be withheld for taxes, if there is an applicable income tax treaty, by completing the necessary parts of Form W-8BEN.</span>
  <span>NOTE: TOPCODER CANNOT ADVISE YOU ON THE EXISTENCE OF AN INCOME TAX TREATY. FURTHERMORE, TOPCODER CANNOT ASSIST YOU IN DETERMINING YOUR ABILITY TO CLAIM A REDUCED RATE OF, OR EXEMPTION FROM, WITHHOLDING. ONCE A MEMBER CLAIMING THE BENEFIT OF A REDUCED TAX WITHHOLDING RATE PURSUANT TO A TAX TREATY PROVIDES ALL NECESSARY FORMS AND INFORMATION TO TOPCODER, TOPCODER WILL MAKE AN INDEPENDENT ASSESSMENT BASED ON THE INFORMATION PROVIDED.</span>

  <h3>HOW DO I CLAIM TAX TREATY BENEFITS UNDER FORM W-8BEN?</h3>
  <span>W-8BEN tax forms will be processed with the standard default 30% tax withholding percentage unless they are properly completed. All members completing the W-8BEN are required to fill out at least the following boxes:</span>
  <span>
    In Part I:
    <ul>
      <li>Box 1 - Name</li>
      <li>Box 3 - Type of Beneficial Owner</li>
      <li>Box 4 - Permanent Residence Address</li>
      <li>Box 5 - Mailing Address (if different from Box 4)</li>
    </ul>
  </span>

  <span>In Part IV: Sign and date the form</span>
  <span>If a member wishes to claim the applicability of a withholding percentage of less than 30% pursuant to a tax treaty between their country of residence and the United States, then additional information must be provided. At a minimum, the member would need to provide the following additional information:</span>

  <span>
    In Part I:
    <ul>
      <li>Box 6 - US Taxpayer ID number</li>
    </ul>
  </span>

  <span>
  In Part II:
    <ul>
      <li>Box 9(a) - provide your country of residence</li>
      <li>Box 10:</li>
      <li>Specify the number of the Article of the treaty between the United States and your country of residence under which you are claiming benefit of the lower withholding percentage;</li>
      <li>Specify the lower withholding percentage you are claiming;</li>
      <li>Specify the type of income on which you are claiming the lower withholding percentage; and</li>
      <li><Provide a brief explanation of your reasoning for why you feel you are entitled to claim the lower withholding percentage pursuant to the applicable Article of the applicable treaty./li>
      <li>Please note you will need to provide a separate W-8BEN for each different type of income on which you are claiming a lower withholding percentage. Topcoder will make an independent assessment of the W-8BEN based on the information provided. A failure to provide the appropriate and accurate information in claiming a lower withholding percentage pursuant to a tax treaty will result in a default 30% tax withholding percentage.</li>
    </ul>
  </span>

  <h3>TAXES WITHHELD FOR MEMBERS COMPLETING FORM W-8BEN:</h3>

  <span>
    Taxes will be withheld from the following payment types for those members who have submitted a Form W-8BEN:
    <ul>
      <li>Data Science/Algorithm Prizes (SRMs, tournaments, or other similar challenges)</li>
      <li>Royalties</li>
      <li>Referral Bonuses</li>
      <li>Certain Digital Run bonuses (the portion of Digital Run bonus earned on submissions which did not place in 1st or 2nd place of the contest)</li>
    </ul>
  </span>

  <span>
    *For purposes of determining which tax form is required from members, Topcoder interprets “performing services” to include all services and competitions in which the member assigns ownership of the winning submission in exchange for compensation. (1) See IRS Notice 2001-4 (as of 8/21/13);
  </span>
`;

export default undefined;
