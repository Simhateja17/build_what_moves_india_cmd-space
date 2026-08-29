/**
 * The guidelines published on the official portal at
 * rtionline.gov.in/guidelines.php, reproduced verbatim.
 *
 * Verbatim is deliberate. This is the text an applicant is asked to accept
 * before filing, so paraphrasing it into the plainer language the rest of
 * this app uses would misrepresent what they agreed to. The plain-language
 * reading sits alongside it on the page instead, never in place of it.
 *
 * `notes` are the unnumbered lines the original hangs under a point;
 * `options` is the lettered sub-list under point 8.
 */
export interface Guideline {
  text: string;
  notes?: string[];
  options?: string[];
}

export const GUIDELINES: Guideline[] = [
  {
    text: "This Web Portal can be used by Indian citizens to file RTI application online and also to make payment for RTI application online. First appeal can also be filed online.",
  },
  {
    text: "An applicant who desires to obtain any information under the RTI Act can make a request through this Web Portal to the Ministries/Departments of Government of India.",
  },
  {
    text: 'On clicking at "Submit Request", the applicant has to fill the required details on the page that will appear.',
    notes: ["The fields marked * are mandatory while the others are optional."],
  },
  { text: "The text of the application may be written at the prescribed column." },
  {
    text: "At present, the text of an application that can be uploaded at the prescribed column is confined to 3000 characters only.",
    notes: [
      "Only alphabets A-Z a-z number 0-9 and special characters , . - _ ( ) / @ : & ? \\ % are allowed in Text for RTI Request application.",
    ],
  },
  {
    text: 'In case an application contains more than 3000 characters, it can be uploaded as an attachment, by using column "Supporting document".',
    notes: [
      "Do not upload Aadhar Card or PAN Card or any other personal Identification (Except BPL Card).",
      "PDF file name should not have any blank spaces.",
    ],
  },
  {
    text: 'After filling the first page, the applicant has to click on "Make Payment" to make payment of the prescribed fee.',
  },
  {
    text: "The applicant can pay the prescribed fee through the following modes:",
    options: [
      "Internet banking;",
      "Using credit/debit card of Master/Visa;",
      "Using UPI",
      "Using RuPay Card.",
    ],
  },
  { text: "Fee for making an application is as prescribed in the RTI Rules, 2012." },
  { text: "After making payment, an application can be submitted." },
  {
    text: "After making payment, if applicant didn't receive the registration number then applicant is advised to wait for the 24-48 working hours as registration number will be generated after reconciliation. Please do not make additional attempt to make payment again. If it is not generated within 24-48 hours kindly send an e-mail at helprtionline-dopt[at]nic[dot]in with transaction details.",
  },
  {
    text: "No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012. However, the applicant must attach a copy of the certificate issued by the appropriate government in this regard, alongwith the application.",
  },
  {
    text: "On submission of an application, a unique registration number would be issued, which may be referred by the applicant for any references in future.",
  },
  {
    text: 'The application filed through this Web Portal would reach electronically to the "Nodal Officer" of concerned Ministry/Department, who would transmit the RTI application electronically to the concerned CPIO.',
  },
  {
    text: "In case additional fee is required representing the cost for providing information, the CPIO would intimate the applicant through this portal. This intimation can be seen by the applicant through Status Report or through his/her e-mail alert.",
  },
  {
    text: 'For making an appeal to the first Appellate Authority, the applicant has to click at "Submit First Appeal" and fill up the page that will appear.',
  },
  { text: "The registration number of original application has to be used for reference." },
  { text: "As per RTI Act, no fee has to be paid for first appeal." },
  { text: "The applicant/the appellant should submit his/her mobile number to receive SMS alert." },
  {
    text: 'Status of the RTI application/first appeal filed online can be seen by the applicant/appellant by clicking at "View Status".',
  },
  {
    text: "All the requirements for filing an RTI application and first appeal as well as other provisions regarding time limit, exemptions etc., as provided in the RTI Act, 2005 will continue to apply.",
  },
];
