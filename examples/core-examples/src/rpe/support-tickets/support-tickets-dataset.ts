import { RPEDatasetEntry } from '@gettoor/core';
import { writeRPEDatasetToString } from '@gettoor/core/rpe-io';

interface SupportTicketExpectedResponse {
  type: string;
  priority: string;
  department: string;
}

function entry(
  id: string,
  message: string,
  type: string,
  priority: string,
  department: string,
  expectedResponseReasoning?: string,
): RPEDatasetEntry<SupportTicketExpectedResponse> {
  return {
    datasetEntryId: id,
    vars: {
      message,
    },
    expectedResponse: {
      type,
      priority,
      department,
    },
    expectedResponseReasoning,
  };
}

export const TRAINING_SUPPORT_TICKETS: RPEDatasetEntry<SupportTicketExpectedResponse>[] = [
  entry(
    'login-server-error',
    'I have been trying to log in for the last hour, but the website keeps showing an internal server error. I need access to my account to finish my work today.',
    'incident',
    'high',
    'Technical Support',
    'Type is incident because the user reports a login failure that is already happening, not a request for a change or a new feature.\n' +
    'Priority is high because the user cannot log in and cannot finish their work today. Login is critical functionality and it is unavailable.\n' +
    'Department is Technical Support because an internal server error on the website is a product failure, not a billing or privacy issue.',
  ),
  entry(
    'mobile-dark-mode',
    'Could you please add dark mode to the mobile application? I often use it at night and the current interface is very bright.',
    'request',
    'low',
    'Technical Support',
    'Type is request because the user asks for dark mode, which is a new feature.\n' +
    'Priority is low because it affects one user, the application can still be used, and a bright interface is a cosmetic inconvenience rather than a block to work.\n' +
    'Department is Technical Support because dark mode is a change to the product interface.',
  ),
  entry(
    'duplicate-charge',
    'I was charged twice for my subscription this month. Please refund the duplicate payment.',
    'request',
    'high',
    'Billing and Payments',
    'Type is request because the user asks for a refund, which is a requested change, rather than only reporting a product failure.\n' +
    'Priority is high because money has already been taken incorrectly and the user cannot recover it without support. A duplicate charge is a serious billing failure, not a minor inconvenience or a routine account update that can wait.\n' +
    'Department is Billing and Payments because the ticket is about a subscription charge and a refund.',
  ),
  entry(
    'invoice-company-details',
    'We need to update the company name and billing address shown on all future invoices.',
    'request',
    'medium',
    'Billing and Payments',
    'Type is request because the user asks to change the company name and billing address on future invoices.\n' +
    'Priority is medium because incorrect invoice details have a meaningful effect, but the user can keep working, the scope is this account, and no critical functionality is unavailable. It is not low because legal billing details are more than a cosmetic fix, and not high because work is not blocked.\n' +
    'Department is Billing and Payments because the change is to invoice content.',
  ),
  entry(
    'personal-data-copy',
    'I would like a copy of all personal information your company y stores about me.',
    'request',
    'medium',
    'Privacy & Data Protection',
    'Type is request because the user asks for a copy of stored personal information, not a report of something that has already failed.\n' +
    'Priority is medium because a request for all stored personal data is meaningful, but it affects one person, the user can continue using the service, and there is no sign that work is blocked or that many users are affected. It is not low because this is more than a minor inconvenience or a cosmetic issue.\n' +
    'Department is Privacy & Data Protection because the ticket is about personal information the company stores.',
  ),
  entry(
    'upload-failures',
    'File uploads randomly fail for several members of our team. Retrying sometimes works, but the issue has been happening every day this week.',
    'incident',
    'medium',
    'Technical Support',
    'Type is incident because uploads are already failing and need attention. The user is not asking for a change or a new feature.\n' +
    'Priority is medium because the failures are meaningful and affect several people every day, but retrying sometimes works, so the team can still continue working and the scope stays limited. It is not high because uploads are not fully unavailable and there is no broader outage. It is not low because a daily failure for several users is more than a minor inconvenience.\n' +
    'Department is Technical Support because file upload is product behavior.',
  ),
  entry(
    'annual-plan-switch',
    'Can you change my current monthly subscription to the annual plan starting with the next billing period?',
    'request',
    'medium',
    'Billing and Payments',
    'Type is request because the user asks to change the subscription from monthly to annual.\n' +
    'Priority is medium because changing the plan is a meaningful account change, but it starts next billing period, the current plan still works, and only this subscription is affected. It is not high because nothing is broken and work can continue. It is not low because a plan change is not a cosmetic or non-urgent convenience tweak.\n' +
    'Department is Billing and Payments because the ticket is about the subscription plan and billing period.',
  ),
  entry(
    'export-date-shift',
    'The export feature produces a CSV file where dates are shifted by one day. This happens on every export we have tried.',
    'incident',
    'medium',
    'Technical Support',
    'Type is incident because the export feature is already producing wrong dates and needs attention. The user is not asking for a new feature.\n' +
    'Priority is medium because incorrect dates on every export are a meaningful problem, but the user can still export and keep working, and the report does not show a broad outage. It is not high because critical functionality is not unavailable. It is not low because wrong dates are more than a cosmetic issue.\n' +
    'Department is Technical Support because this is a defect in the product export feature.',
  ),
  entry(
    'missing-vat-number',
    'Our invoice for September is missing our VAT number. Could you send us a corrected invoice?',
    'request',
    'medium',
    'Billing and Payments',
    'Type is request because the user asks for a corrected invoice, which is a requested change to a billing document.\n' +
    'Priority is medium because a missing VAT number matters for this invoice, but the user can keep working and the scope is one invoice. It is not high because work is not blocked and critical functionality is available. It is not low because a missing tax identifier is a meaningful billing correction, not a cosmetic issue.\n' +
    'Department is Billing and Payments because the ticket is about invoice content.',
  ),
  entry(
    'account-data-deletion',
    'Please delete my account and all personal data associated with it. I no longer want my information stored by your service.',
    'request',
    'medium',
    'Privacy & Data Protection',
    'Type is request because the user asks for their account and personal data to be deleted, which is a requested change.\n' +
    'Priority is medium because deleting stored personal data is meaningful, but it affects one account, the user is not blocked from working, and there is no breach or impact on many users. It is not low because erasure of personal data is not a minor inconvenience or a cosmetic request. It is not high because critical functionality is still available and the scope is limited.\n' +
    'Department is Privacy & Data Protection because the ticket is about deleting an account and the personal data stored with it.',
  ),
  entry(
    'save-tooltip-typo',
    'The tooltip that appears when I hover over the Save button says "Svae changes". Saving works correctly, so this is only a spelling mistake.',
    'incident',
    'low',
    'Technical Support',
    'Type is incident because the tooltip text is already wrong and needs attention. The user is not asking for a new feature.\n' +
    'Priority is low because it affects one user, saving still works, and a spelling mistake is a cosmetic issue with a minor impact on productivity.\n' +
    'Department is Technical Support because the mistake is in the product interface.',
  ),
  entry(
    'widget-order-memory',
    'Could the dashboard remember the order I drag the widgets into? I can rearrange them each time I sign in, so this is not urgent.',
    'request',
    'low',
    'Technical Support',
    'Type is request because the user asks the dashboard to remember widget order, which is a new behavior.\n' +
    'Priority is low because one user is affected, they can keep working by rearranging the widgets, and the user says the change is not urgent. The impact on productivity is minor.\n' +
    'Department is Technical Support because this is a change to product behavior.',
  ),
  entry(
    'payment-email-spacing',
    'The payment confirmation email has an extra blank line before the greeting. The payment went through and every amount in the email is correct.',
    'incident',
    'low',
    'Billing and Payments',
    'Type is incident because the confirmation email already has a formatting error and needs attention. The user is not asking for a new feature.\n' +
    'Priority is low because the payment succeeded, the amounts are correct, and an extra blank line is a cosmetic issue for one user. Work can continue and the impact is minor.\n' +
    'Department is Billing and Payments because the email confirms a payment.',
  ),
  entry(
    'public-privacy-policy-copy',
    'Could you send me a copy of your current public privacy policy for my records? I am not asking for any of my personal data.',
    'request',
    'low',
    'Privacy & Data Protection',
    'Type is request because the user asks to be sent a copy of the public privacy policy.\n' +
    'Priority is low because one person wants a public document for their records, no personal data or account change is involved, and there is no impact on productivity. It is a non-urgent request.\n' +
    'Department is Privacy & Data Protection because the document requested is the privacy policy.',
  ),
];

export const VALIDATION_SUPPORT_TICKETS: RPEDatasetEntry<SupportTicketExpectedResponse>[] = [
  entry(
    'editor-crash-data-loss',
    'The application stopped responding while I was editing a document and I lost the changes I had made during the last 20 minutes.',
    'incident',
    'high',
    'Technical Support',
  ),
  entry(
    'block-file-downloads',
    'It would be useful if project owners could prevent other users from downloading attached files. Is that something you can add?',
    'request',
    'low',
    'Technical Support',
  ),
  entry(
    'renewal-card-declined',
    'My card was declined when renewing the subscription, although the same card works elsewhere and has sufficient funds.',
    'incident',
    'high',
    'Billing and Payments',
  ),
  entry(
    'withdraw-marketing-consent',
    'I previously agreed to receive marketing emails, but I want to withdraw that consent and stop my information being used for marketing.',
    'request',
    'medium',
    'Privacy & Data Protection',
  ),
  entry(
    'delayed-notifications',
    'For the past two weeks, notifications sometimes arrive immediately and sometimes several hours late. There does not seem to be a consistent pattern.',
    'incident',
    'medium',
    'Technical Support',
  ),
  entry(
    'remove-user-license',
    'Please remove the extra user license from our subscription before the next renewal because that employee has left the company.',
    'request',
    'medium',
    'Billing and Payments',
  ),
  entry(
    'discount-sort-error',
    'When I sort products by price, the order is wrong whenever discounted products are included. This has happened every time I tested it.',
    'incident',
    'medium',
    'Technical Support',
  ),
  entry(
    'annual-account-statement',
    'Could you provide a statement showing all invoices and payments made on our account during the previous financial year?',
    'request',
    'medium',
    'Billing and Payments',
  ),
  entry(
    'customer-data-email-leak',
    'I received an email containing another customer\'s name and order details. I am concerned that personal information is being sent to the wrong people.',
    'incident',
    'high',
    'Privacy & Data Protection',
  ),
  entry(
    'comment-timezone-label',
    'Comment timestamps show the correct time, but they do not say which time zone they use. I can still read every comment and reply as usual.',
    'incident',
    'low',
    'Technical Support',
  ),
  entry(
    'billing-history-card-brand',
    'Could the billing history show the card brand next to the last four digits? I can already tell the payments apart, this would only make them easier to recognize.',
    'request',
    'low',
    'Billing and Payments',
  ),
  entry(
    'inactive-data-retention',
    'Could you tell me how long you keep data for an inactive account before it is removed? I do not need a copy of my information or any change to my account.',
    'request',
    'medium',
    'Privacy & Data Protection',
  ),
];

export const TEST_SUPPORT_TICKETS: RPEDatasetEntry<SupportTicketExpectedResponse>[] = [
  entry(
    'service-connection-timeout',
    'None of our employees can connect to the service this morning. We all get a connection timeout, even from different networks.',
    'incident',
    'high',
    'Technical Support',
  ),
  entry(
    'auto-archive-projects',
    'Could you add an option to automatically archive completed projects after a configurable number of days?',
    'request',
    'low',
    'Technical Support',
  ),
  entry(
    'charge-after-cancellation',
    'I cancelled my subscription last week, but another payment was taken from my account today.',
    'incident',
    'high',
    'Billing and Payments',
  ),
  entry(
    'invoice-legal-details',
    'We changed our legal entity last month. Please update the legal company name and tax identification number used on future invoices.',
    'request',
    'medium',
    'Billing and Payments',
  ),
  entry(
    'third-party-data-sharing',
    'Can you tell me which third-party companies receive my personal data and what information is shared with each of them?',
    'request',
    'medium',
    'Privacy & Data Protection',
  ),
  entry(
    'slow-search',
    'Search has become increasingly slow as we add more records. It used to return results almost instantly, but now it regularly takes 15 to 30 seconds.',
    'incident',
    'high',
    'Technical Support',
  ),
  entry(
    'bank-transfer-switch',
    'Please switch the payment method for our account from the current credit card to bank transfer for future invoices.',
    'request',
    'medium',
    'Billing and Payments',
  ),
  entry(
    'cross-workspace-products',
    'Users occasionally see products from another workspace in the recommendations panel. Refreshing the page usually makes them disappear, but the issue keeps coming back.',
    'incident',
    'high',
    'Technical Support',
  ),
  entry(
    'payment-not-recorded',
    'We made a payment three days ago, but the invoice is still marked as unpaid in the portal. Could you check whether the payment was received?',
    'request',
    'medium',
    'Billing and Payments',
  ),
  entry(
    'profile-phone-update',
    'My profile contains an old phone number and I cannot change it myself. Please replace it with the new number I provided in my account settings.',
    'request',
    'medium',
    'Technical Support',
  ),
  entry(
    'empty-state-blur',
    'The illustration on the empty tasks page looks slightly blurry. The task list is sharp, and I can create and complete tasks as usual.',
    'incident',
    'low',
    'Technical Support',
  ),
  entry(
    'renewal-date-words',
    'Could the subscription page also show the renewal date in words, such as "1 March", next to the numeric date? I can already read the date that is there.',
    'request',
    'low',
    'Billing and Payments',
  ),
  entry(
    'cookie-settings-menu-link',
    'Could the account menu include a link to the cookie settings? I can already open them from the footer, so this is only for convenience.',
    'request',
    'low',
    'Privacy & Data Protection',
  ),
];

console.log(writeRPEDatasetToString({ entries: TEST_SUPPORT_TICKETS }, 'yaml'));