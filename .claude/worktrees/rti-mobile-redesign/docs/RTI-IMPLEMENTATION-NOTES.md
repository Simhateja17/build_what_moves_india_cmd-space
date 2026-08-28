# RTI Online citizen module - implementation notes

Source: `um_citizen.pdf`, the supplied **User Manual - Right To Information (RTI), Citizen Module**, 29 printed pages. The manual gives the RTI software URL as `https://rtionline.gov.in` on page 2. Page references below are to the page numbers printed in the manual. These notes are an extraction of the supplied manual only; they do not add legal rules from outside the PDF.

The manual has both selectable text and embedded screenshots. Where the screenshot and the surrounding prose disagree, both are recorded. Where a screenshot is too low-resolution to establish the complete text, the unreadable part is explicitly marked rather than guessed.

## 1. Form Fields & Validation Rules

### Portal-wide form conventions and entry gate

- The manual says the portal can be used by Indian citizens to file an RTI application online, make payment for an RTI application online, and file a First Appeal online. It describes requests to Ministries/Departments of the Government of India. [PDF pp. 4, 12-13]
- Before either Submit Request or Submit First Appeal opens its form, the citizen is shown `GUIDELINES FOR USE OF RTI ONLINE PORTAL` and must tick the checkbox `I have read and understood the above guidelines.` and click `Submit`. [PDF pp. 3-4, 12-13]
- The forms display `Note: Fields marked with * are Mandatory.` The manual also states: `The fields marked * are mandatory while the others are optional.` [PDF pp. 4-6, 15]
- The page header includes a `Select Language` dropdown. The screenshots show `English`; the manual does not enumerate the available languages or any validation rule for this control. [PDF pp. 5, 14-15]
- The screenshots show `Public Authorities Available` in the header. This is a link/label, not described as a form field, and no behavior is documented.

### Submit Request - fields shown

The request form is titled `Online RTI Request Form`. The required/optional classification below follows the visible `*` markers and the manual's rule that unmarked fields are optional.

| Exact field label as shown | Required? | Values, limits, or behavior stated in the manual |
|---|---|---|
| `Search Public Authority` | No `*` visible | Placeholder: `Type name or part of name of public authority`. No search matching, minimum length, or error behavior is specified. [PDF p. 5 screenshot] |
| `Select Ministry/Department/Apex body` | Yes | Dropdown. The manual says the Ministry or Department for which the applicant wants to file an RTI has to be selected from this dropdown. The option list is not reproduced. [PDF p. 5] |
| `Select Public Authority` | Yes | Dropdown. The screen adds `(Your Request will be filed with this selected Public Authority)`. The option list and the exact filtering behavior are not stated. [PDF p. 5 screenshot] |
| `Email-ID` | Yes | Input placeholder shown as `e.g user@domain.com`. No exact email grammar, length, or normalization rule is stated. [PDF p. 5 screenshot] |
| `Mobile Number (For receiving SMS alerts)` | No `*` visible | Optional. The manual says SMS alerts are sent if the citizen provides a mobile number. The screenshots show a `+91` prefix and a number input; length and digit rules are not stated. [PDF pp. 5-6, 11] |
| `Confirm Email-ID` | Yes | Confirmation input. The label implies confirmation, but the manual does not expressly state the equality/error rule. [PDF p. 5 screenshot] |
| `Name` | Yes | No character set or length rule is stated. [PDF p. 5 screenshot] |
| `Gender` | Yes | Radio options shown: `Male`, `Female`, `Third Gender`. [PDF p. 5 screenshot] |
| `Address` | Yes | The screenshot shows three visible address-line inputs, with only the first line labelled `Address`. No address length or character rule is stated. [PDF p. 5 screenshot] |
| `Pin code` | No `*` visible | Optional. No length, numeric-only, or country-specific validation is stated. [PDF p. 5 screenshot] |
| `Country` | No `*` visible | Radio options shown: `India`, `Other`; `India` is selected in the screenshot. The manual does not say what extra behavior occurs when `Other` is selected. [PDF p. 5 screenshot] |
| `State` | No `*` visible | Dropdown. The screenshot shows `--Select--`; the option list and any dependency on Country are not stated. [PDF p. 5 screenshot] |
| `Status` | No `*` visible | Radio options shown: `Rural`, `Urban`. [PDF p. 5 screenshot] |
| `Educational Status` | No `*` visible | Radio options shown: `Literate`, `Illiterate`. [PDF p. 5 screenshot] |
| `Phone Number` | No `*` visible | Optional. The screenshot shows a `+91` prefix and a number input. No length or digit rule is stated. [PDF p. 5 screenshot] |
| `Citizenship` | No `*` visible | Dropdown shown with `Indian`. Helper text: `(Only Indian citizens can file RTI Request application)`. The manual does not enumerate any other options or explain behavior for a non-Indian selection. [PDF p. 5 screenshot] |
| `Is the Applicant Below Poverty Line ?` | Yes | Dropdown with `Yes` and `No`. This selection controls the fee and the BPL fields/attachment path described below. [PDF pp. 6-8] |
| `BPL Card No.` | No `*` visible in the BPL screenshot | Only shown in the BPL `Yes` path. Helper text: `(Proof of BPL may be provided as an attachment)`. No format or length rule is stated. [PDF p. 6 screenshot] |
| `Year of Issue` | No `*` visible | Only shown in the BPL `Yes` path. No year format or range is stated. [PDF p. 6 screenshot] |
| `Issuing Authority` | No `*` visible | Only shown in the BPL `Yes` path. No character or length rule is stated. [PDF p. 6 screenshot] |
| `Text for RTI Request application` | Yes | The manual says this text should be `upto 3000 characters`. If the RTI application is more than 3000 characters, it can be uploaded in `Supporting document`. The allowed-character statements are recorded below because the screenshot and prose differ. [PDF pp. 7-8] |
| `Supporting document` | No `*` visible for the non-BPL screenshot; `*` visible in the BPL screenshot | Helper text: `(only pdf upto 1 MB)`. Used for an RTI text longer than 3000 characters and for the BPL proof path. The manual says the document should be in PDF format and `upto 1MB`. [PDF pp. 6, 8] |
| `Enter security code` | Yes | CAPTCHA image plus an input and a `Refresh` link. No CAPTCHA length, case-sensitivity, or allowed-character rule is stated. [PDF pp. 6, 8] |

The request form's visible action controls are `Make Payment`, `Submit` (BPL path), and `Reset`. They are actions rather than applicant data fields. The payment flow also shows `Payment Gateway`, `Pay`, and `Back`; see Section 4.

### Submit Request - conditional logic

1. **Ministry/Department/Apex body and Public Authority.** The form presents `Select Ministry/Department/Apex body` before `Select Public Authority`, and tells the citizen that the request will be filed with the selected Public Authority. This visually implies an authority-selection dependency. The manual explicitly explains the Ministry/Department selection but does not state the exact cascading/filtering algorithm or what happens if the authority list is empty.
2. **BPL = Yes.** The citizen selects `Yes` in `Is the Applicant Below Poverty Line ?`, supplies the BPL details shown on screen, and must upload BPL proof in `Supporting document` according to the prose: `he/she has to upload BPL card certificate in Supporting document field.` The manual also says: `However the applicant must attach a copy of the certificate issued by the appropriate government in this regard, alongwith the application.` No fee is required, and the citizen clicks `Submit` directly. [PDF pp. 6-7; guideline item 12 on pp. 4 and 13]
3. **BPL = No.** The citizen selects `No`, is shown `You are required to pay the RTI fee of ₹ 10`, clicks `Make Payment`, chooses a payment mode, and proceeds to the payment gateway before submission. [PDF pp. 7-10]
4. **Request text longer than 3000 characters.** The manual says the excess/full RTI application can be uploaded as an attachment in `Supporting document`. It does not say whether the text field may be left empty, whether a text over 3000 is rejected, or whether both text and attachment are required.

### Submit Request - character restrictions and upload rules

The prose note says verbatim:

> `Only alphabets A-Z a-z number 0-9 and special characters , . - _ ( ) / @ : & \ % are allowed in Text for RTI Request application.` [PDF p. 8]

The embedded request-form screenshot on the same page visibly includes a `?` in the list, rendering the list as `, . - _ ( ) / @ : & ? \ %`. The surrounding selectable-text note omits `?`. The manual therefore does not establish whether `?` is accepted. A space is not listed in either version; the manual does not say whether spaces are accepted.

The upload rule stated for the request and BPL proof is:

> `Supporting document should be in PDF format and upto 1MB.` [PDF p. 6]

No filename rule is stated. The manual does not specify case sensitivity of `.pdf`, MIME checking, filename length, permitted filename characters, number of files, page count, or whether password-protected/encrypted PDFs are accepted.

### Submit First Appeal - initial lookup form

After the citizen accepts the guidelines, the first screen is `Online RTI First Appeal Form`. The fields shown are:

| Exact field label as shown | Required? | Values, limits, or behavior stated in the manual |
|---|---|---|
| `RTI Request Registration No.` | Yes | Used to look up the original request. The manual says the applicant can enter the Request Registration no., Email Id, and security code. [PDF p. 14] |
| `Enter Email Id` | Yes | No format or length rule is stated. [PDF p. 14 screenshot] |
| `Enter Security code` | Yes | CAPTCHA image, input, and `refresh` link. No code validation rule is stated. [PDF p. 14 screenshot] |

The action controls are `Submit` and `Reset`. Clicking `Submit` displays the full first-appeal form. [PDF pp. 14-15]

### Submit First Appeal - full form fields shown

The full form is titled `Online RTI First Appeal Form` and labels the personal-details group `Personal Details of Appellant:-`.

| Exact field label as shown | Required? | Values, limits, or behavior stated in the manual |
|---|---|---|
| `Select Ministry/Department/Apex body` | Yes | Dropdown. The screenshot shows `The Institute of Chartered Accountants of India` as an example selected value. The option list is not stated. [PDF p. 15 screenshot] |
| `Request Registration Number` | Yes | The original request number is shown/pre-filled in the example. The manual separately says `The registration number of original application has to be used for reference.` [PDF pp. 4, 15] |
| `Request Registration Date` | Yes | The screenshot shows a date input and a calendar/help icon. Date format and editability are not stated. [PDF p. 15 screenshot] |
| `Name` | No `*` visible | Example value is prefilled. No length or character rule is stated. [PDF p. 15 screenshot] |
| `Gender` | No `*` visible | Radio options shown: `Male`, `Female`, `Third gender` (the request screenshot capitalizes `Gender`). [PDF p. 15 screenshot] |
| `Address` | Yes | Three visible address-line inputs; only the first is labelled `Address`. No length/character rule is stated. [PDF p. 15 screenshot] |
| `Pincode` | No `*` visible | Optional by the form convention. No format rule is stated. [PDF p. 15 screenshot] |
| `Country` | No `*` visible | Options shown: `India`, `Other`. [PDF p. 15 screenshot] |
| `State` | No `*` visible | Dropdown. Option list and dependencies are not stated. [PDF p. 15 screenshot] |
| `Status` | No `*` visible | Options shown: `Rural`, `Urban`. [PDF p. 15 screenshot] |
| `Educational Status` | No `*` visible | Options shown: `Literate`, `Illiterate`. [PDF p. 15 screenshot] |
| `Phone Number` | No `*` visible | Screenshot shows `+91` and a number input. No validation rule is stated. [PDF p. 15 screenshot] |
| `Mobile Number (For receiving SMS alerts)` | No `*` visible | Optional; mobile number is used for SMS alerts. Screenshot shows `+91`. No length/digit rule is stated. [PDF p. 15 screenshot] |
| `Email-Id` | Yes | No exact email validation rule is stated. [PDF p. 15 screenshot] |
| `Citizenship` | No `*` visible | Helper: `(Only Indian citizens can file RTI Request application)`. Screenshot value is `Indian`; other options are not enumerated. [PDF p. 15 screenshot] |
| `Is the Applicant Below Poverty Line ?` | Yes | Dropdown with `Yes`/`No`. The manual gives no fee for first appeal and shows no BPL-fee branch after this field. [PDF pp. 15-16] |
| `Ground For Appeal` | Yes | Dropdown. The choices visible in the screenshot are listed exactly below. [PDF pp. 15-16] |
| `Text for RTI first appeal application` | Yes | The prose says `upto 3000 characters`; the screenshot helper says `upto 500 characters` while the visible counter says `0/3000 Characters entered`. This is an unresolved manual conflict. [PDF pp. 15-16] |
| `Supporting document` | No `*` visible | Helper: `(only pdf upto 1 MB)`. The manual says a first-appeal application longer than the stated text limit can be uploaded here. [PDF pp. 15-16] |
| `Enter security code` | Yes | CAPTCHA image, input, and `Refresh`. No code validation rule is stated. [PDF pp. 15-16] |

The full first-appeal form has `Submit` and `Reset` actions. The manual states: `As per RTI Act, no fee has to be paid for first appeal.` [PDF p. 16]

### First-appeal Ground For Appeal values

The open dropdown screenshot shows these entries:

- `--Select--`
- `Refused access to Information Requested`
- `No Response Within the Time Limit`
- `Unreasonable amount of Fee required to Pay`
- `Provided Incomplete,Misleading or False Information`
- `Any Other ground`

The manual does not define a separate validation or evidence requirement for any choice. It also does not define the duration represented by `the Time Limit`.

### First-appeal character and upload ambiguity

The manual's first-appeal prose note says:

> `Only alphabets A-Z a-z number 0-9 and special characters , . - _ () / @ : & ? \ % are allowed in Text for RTI Request Application.` [PDF p. 16]

This note says `Text for RTI Request Application` even though it appears on the first-appeal form; that is a label inconsistency in the manual. The screenshot note uses the first-appeal context but is low-resolution. A space is not listed; acceptance of spaces is not stated.

The first-appeal upload rule is:

> `Supporting document should be in PDF format upto 1MB.` [PDF p. 16]

No filename, MIME, count, page-count, or encryption rule is stated.

## 2. Process Timeline & Legal Deadlines

### Deadline/timing statements actually present

| Time statement | Trigger and expected event | What the manual says the citizen should do | Citation stated in the manual |
|---|---|---|---|
| `24 to 48 working hours` | After payment, if the registration number has not been received. The manual says the registration number will be generated after reconciliation. | Wait. Do not make another payment or another attempt to register the same request. If the number is still not generated, send an e-mail to the help address printed in the guideline with transaction details. The address is not reliably legible in the supplied low-resolution raster screenshot, so it is not transcribed as a confirmed address here. [PDF pp. 4, 9, 13, 20] | No RTI Act section or specific rule is cited for this portal reconciliation window. The nearby fee statement cites `RTI Rules, 2012`, but does not assign that citation to the 24-48-hour window. |
| No duration supplied for `No Response Within the Time Limit` | The phrase is a selectable `Ground For Appeal` value. | The citizen can use the `Submit First Appeal` flow and the original request registration number, but the manual does not say how long the time limit is or when the appeal becomes eligible. [PDF pp. 14-16] | No section or rule number is supplied. |
| No deadline supplied for an additional payment | A CPIO demands more money representing the cost of providing information. | The CPIO is described as informing the applicant through the portal; the applicant can see the intimation in the Status Report or through an e-mail alert, then click `Make Payment`. [PDF pp. 4, 20] | No section or rule number is supplied, and no payment window or consequence for non-payment is given. |

The only general legal-timing statement in the guidelines is:

> `All the requirements for filing an RTI application and first appeal as well as other provisions regarding time limit, exemptions etc., as provided in the RTI Act, 2005 will continue to apply.` [PDF pp. 4, 13]

This is a cross-reference, not a statement of an individual deadline.

### Deadlines not covered by this manual

The supplied manual does **not** state any of the following numbers or corresponding section/rule citations:

- 30 days for a PIO/CPIO reply.
- 45 days for a First Appeal decision.
- 90 days for a Second Appeal.
- A filing period for the First Appeal or Second Appeal.
- A deadline for transfer to another public authority.
- A deadline for correcting/re-uploading an inaccessible attachment.
- A deadline for responding to an additional-fee demand.
- A Section 6(3) citation or any other numbered transfer provision.
- A Section 20 citation or any penalty-related deadline.

The manual uses the terms `RTI Act, 2005` and `RTI Rules, 2012`, but it does not give a specific numbered section or rule for the 30/45/90-day examples or for the portal states.

The dates visible in status examples (`Date of filing`, `Date of action`, and `Status date`) are record fields, not deadlines. The manual does not state how a deadline clock starts, whether it pauses, or how transfer/additional-fee events affect it.

## 3. Penalty & Accountability Provisions

### Section 20 and PIO penalties

The manual contains no mention of `Section 20`, a penalty against a PIO/CPIO, a daily penalty amount, a maximum cap, a hearing, recovery/enforcement, withholding of salary, or disclosure of penalty status. It also does not state that an applicant may claim or receive a penalty.

It follows from the document's omissions that the manual does not tell the applicant:

- whether a missed response deadline automatically creates a penalty;
- how a penalty would be calculated or capped;
- which authority decides or enforces it;
- whether the applicant is notified while a penalty proceeding is pending or after it is decided; or
- whether the applicant can see a `penalty status` in `View Status`, `View History`, or any reply.

Do not implement those as manual-backed facts. They require a separately verified legal/product source.

### Accountability surfaces the manual does show

- A submitted request goes electronically to the concerned Ministry/Department's `Nodal Officer`, who transmits it electronically to the concerned `CPIO`. [PDF p. 11]
- A submitted First Appeal goes electronically to the concerned `Nodal Officer`, who transmits it electronically to the concerned `Appellate Authority`. [PDF p. 17]
- The status view shows `Status`, a `Date of action`, `Reply / Remarks`, and `Nodal Officer Details` including `Telephone Number` and `Email Id` in the example. [PDF p. 19]
- A CPIO's additional-fee intimation is shown through the portal, and the guideline says it can be seen in the Status Report or through an e-mail alert. [PDF pp. 4, 20]
- The portal exposes `View Status` for an online RTI application/First Appeal and `View History` lists request/appeal buckets. [PDF pp. 18, 26-29]

None of these surfaces includes a penalty calculation, penalty proceeding, statutory clock, or applicant-facing escalation result.

## 4. Fee Structure

### Initial request fee

| Applicant/path | Amount and manual wording | Payment/action |
|---|---|---|
| Non-BPL request | `RS 10` / the form warning `You are required to pay the RTI fee of ₹ 10`. The manual says this is prescribed in the `RTI Rules, 2012`. [PDF pp. 7-8] | Select `No` for `Is the Applicant Below Poverty Line ?`, click `Make Payment`, select a mode, click `Payment Gateway`, then click `Pay`. |
| BPL request | `No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012.` [PDF p. 6] | Select `Yes`, provide/attach the required BPL certificate/proof, and click `Submit` without the non-BPL payment path. |
| First Appeal | `As per RTI Act, no fee has to be paid for first appeal.` [PDF p. 16] | The First Appeal form has `Submit` and `Reset`; no first-appeal payment page is described. |

### Payment modes

The request instructions list:

- `Internet banking`;
- credit/debit card of `Master/Visa` and `RuPay Card`; and
- `UPI` in the request-form/payment-form text. [PDF pp. 7-9]

The separate guideline screenshot's item 8 lists `(a) Internet banking, (b) Using credit/debit card of Master/Visa; (c) Using RuPay Card` and does **not** show UPI, while the selectable request-form text and `Online Request Payment Form` list `UPI`. This is a source inconsistency; UPI is nevertheless explicitly present in the later payment-mode list.

The payment screenshots identify the external screen as `STATE BANK MULTI OPTION PAYMENT SYSTEM`, and the portal note says that clicking `Pay` directs the applicant to the `SBI Payment Gateway`. [PDF pp. 9-10]

### BPL proof

- The citizen selects `Yes` in `Is the Applicant Below Poverty Line ?`.
- The prose says the citizen has to upload a `BPL card certificate` in `Supporting document`.
- The guideline says the citizen must attach `a copy of the certificate issued by the appropriate government in this regard, alongwith the application`.
- The BPL screenshot shows `BPL Card No.`, `Year of Issue`, and `Issuing Authority`, but no `*` is visible beside those three labels; `Supporting document` is starred in that BPL example and is annotated `(Upload the proof of BPL status)`.
- The manual does not explain how the portal validates the certificate, whether the three BPL text fields are independently required, or what happens when the proof is rejected/missing.

### Payment success, payment reconciliation, and payment failure

The documented success path is:

1. After the non-BPL form is filled, click `Make Payment`.
2. `Online Request Payment form` is displayed.
3. Select one of the payment modes and select/click `Payment Gateway`.
4. Click `Pay`; the applicant is directed to the payment gateway.
5. After completing payment, the applicant is redirected back to RTI Online Portal.
6. On submission, a `unique registration number` is issued for future reference.
7. The applicant gets an e-mail and an SMS alert if a mobile number was provided. [PDF pp. 7-11]

If payment has been made but no registration number appears, the manual says to wait `24 to 48 working hours` for reconciliation, not to make an additional payment/registration attempt, and to send transaction details to the help address if the number is still not generated. The payment screenshot separately warns: `Do not use Refresh and back button of browser` and `MEANWHILE PLEASE DO NOT MAKE ATTEMPT TO REGISTER THE SAME REQUEST AGAIN.` [PDF pp. 4, 9, 13, 20]

The manual does not document a distinct gateway-declined/no-money-deducted flow, a retry button, a refund workflow for ordinary payment failure, or a payment receipt state. Do not infer that payment failure and payment-deducted-without-registration are the same state.

### Additional payment

The View Status example shows:

- status text beginning `ADDITIONAL PAYMENT REQUIRED FOR INFORMATION ...` (the right edge of the low-resolution screenshot truncates the remainder);
- an `Additional Payment` row with an example `₹ 100` and a `Make Payment` link; and
- the remark `Please provide Rs 100 for photocopy`.

The manual says: `Additional payment can be made by clicking on Make Payment link. Then the applicant will be directed to payment gateway.` The ₹100 and photocopy remark are an example, not a general fee table. No additional-fee schedule, calculation formula, due date, or post-payment status is supplied. [PDF p. 20]

### Refund on wrong government level

For an RTI application filed for a public authority under a State Government, including the Government of NCT, New Delhi, the manual says the application will be returned `without refund of amount`. The citizen is told to file it before the concerned public authority under the State Government. [PDF pp. 4, 22]

## 5. Status Values & Application Lifecycle

### Status lookup and result fields

`View Status` is described as the place where the status of an online RTI application/First Appeal can be viewed. The lookup form shows these mandatory inputs:

- `Enter Registration Number`;
- `Enter Email Id`; and
- `Enter Security code`.

The action is `Show` (with `Reset`), followed by a status result. [PDF pp. 18-19]

The example result contains these display fields/actions:

- `Registration Number` / `Enter Registration Number`;
- `Name`;
- `Date of filing`;
- `Public Authority` or `Request filed with`;
- `Status`;
- `Date of action`;
- `Reply / Remarks`;
- `Nodal Officer Details`;
- `Telephone Number`;
- `Email Id`;
- `Print RTI Application`;
- `Print Status`; and
- `Go Back`.

### Distinct status/state text shown or named by the manual

The following are the distinct lifecycle/status labels shown in the examples. Some are exact status strings; some are dashboard buckets or user-interface notices and should not be conflated.

| Status/state text | Type and documented trigger/meaning |
|---|---|
| `Your RTI Request filed successfully.` | Submission confirmation. A unique registration number is issued. [PDF pp. 7, 10-11] |
| `Your RTI Appeal filed successfully.` | First-Appeal submission confirmation. A unique registration number is issued. [PDF p. 17] |
| `Registered` | View History dashboard bucket under `Requests` and under `Appeals`; no internal transition rule is defined. [PDF pp. 27-29] |
| `Pending` | View History dashboard bucket under `Requests` and under `Appeals`; no definition or clock rule is defined. [PDF pp. 27-29] |
| `Disposed of` | View History dashboard bucket under `Requests` and under `Appeals`; no definition or transition rule is defined. [PDF pp. 27-29] |
| `RTI REQUEST APPLICATION RETURNED TO APPLICANT` | Status shown when the request is returned, with a `Date of action` and `Reply / Remarks`. The example explains that this happens for State Government public authorities, including Government of NCT, New Delhi, which are outside the described portal filing scope. [PDF pp. 19, 22, 29] |
| `ADDITIONAL PAYMENT REQUIRED FOR INFORMATION ...` | Status shown when additional payment is required. The screenshot's low-resolution right edge truncates the remainder of the phrase. It exposes an `Additional Payment` amount and `Make Payment` link. [PDF p. 20] |
| `SUPPORTING DOCUMENT REQUIRED FROM APPLICANT ...` | Status shown when the document attached at filing is not accessible. The visible status begins `SUPPORTING DOCUMENT REQUIRED FROM APPLICANT`; the screenshot continues with an unreadable/truncated date suffix. [PDF p. 21] |
| `REQUEST TRANSFERRED TO OTHER PUBLIC AUTHORITY` | Status shown when the request is transferred. The result displays details of the destination Public Authority and a new registration number. [PDF p. 23] |
| `REQUEST FORWARDED TO CPIO` | Current status in the multiple-CPIO details table. The top message says the request has been forwarded to multiple CPIOs; each part is shown with this current status. [PDF p. 24] |
| `File upload successfully` | Upload confirmation message after the citizen re-uploads a document from View Status. This is a UI confirmation, not a final RTI disposition. [PDF p. 21] |

The exact `ADDITIONAL PAYMENT...` and `SUPPORTING DOCUMENT...` strings are intentionally not completed beyond the legible text; the manual image does not support a reliable transcription of the truncated suffixes.

### Documented transitions and branches

1. **Guidelines accepted -> form.** Tick `I have read and understood the above guidelines.` and click `Submit` to reach the request or First Appeal form. [PDF pp. 3-4, 12-13]
2. **Request submission.** BPL requests submit directly after proof/fields; non-BPL requests go through payment. Successful submission produces a unique registration number. [PDF pp. 6-11]
3. **Portal routing.** A request goes to the concerned Ministry/Department's `Nodal Officer`, who transmits it to the concerned `CPIO`. A First Appeal goes through the Nodal Officer to the concerned `Appellate Authority`. [PDF pp. 11, 17]
4. **Additional fee branch.** The status shows an additional payment amount, remark, and `Make Payment` link. The citizen is sent to the payment gateway. The manual does not document the resulting status after payment. [PDF p. 20]
5. **Inaccessible attachment branch.** The status asks for an upload. The citizen selects a file with `Choose File` and clicks `Attached`; a `File upload successfully` message is then shown. [PDF p. 21]
6. **Return branch.** The status becomes `RTI REQUEST APPLICATION RETURNED TO APPLICANT`; the citizen is told to file before the concerned State Government public authority, without refund. [PDF p. 22]
7. **Transfer branch.** The status becomes `REQUEST TRANSFERRED TO OTHER PUBLIC AUTHORITY`, destination-authority details are displayed, and the manual says a new registration number is generated. The citizen must use the new number for later status viewing. [PDF p. 23]
8. **Multiple-CPIO branch.** When a Nodal Officer forwards the application to multiple CPIOs, the portal shows `Click here to view details`. If there are four CPIOs, four registration numbers are generated, the application is divided into four parts, each part can be tracked separately, and four replies are received. [PDF pp. 24-25]
9. **History buckets.** After the View History identity/OTP flow, the citizen sees `Registered Requests`, `Disposed of Requests`, `Pending Requests`, `Registered Appeals`, `Disposed of Appeals`, and `Pending Appeals`. The manual does not define transitions among these buckets. [PDF pp. 26-29]

The example View History screen is headed `Request/Appeal Status as on 15-12-2021` and shows sample counts: Requests - `Registered [8]`, `Disposed of [5]`, `Pending [3]`; Appeals - `Registered [3]`, `Disposed of [3]`, `Pending [0]`. These are screenshot data, not configured limits or legal states. [PDF p. 28]

### Registration-number format and branch identifiers

The manual states:

> `Please note that the format of registration number is as follows- AAAAA/B/C/DD/EEEEE where`

- `AAAAA - Public Authority Code`
- `B - R for Request and A for Appeal`
- `C - E - Online Receipt`
- `  P - Physical Receipt`
- `  T - Transfer From Other Public Authority`
- `  X - Part Transfer Cases`
- `  L - Legacy Receipt`
- `DD - Last two digits of year`
- `EEEEE - 5 digits serial number` [PDF p. 29]

The multiple-CPIO example gives these four numbers:

```text
DOP&T/R/E/20/07619
DOP&T/R/E/20/07619/1
DOP&T/R/E/20/07619/2
DOP&T/R/E/20/07619/3
```

The manual says that the application is divided into four parts and the applicant can see the status of the four parts using the four different registration numbers. It also says four replies will be received. [PDF p. 25]

## 6. Edge Cases & Escalation Paths

| Trigger/edge case | What the manual tells the citizen to do | What the portal/manual shows | What is not covered |
|---|---|---|---|
| No registration number after payment | Wait `24 to 48 working hours` for reconciliation; do not pay again or try to register the same request again; if still absent, e-mail the printed help address with transaction details. | Payment page warning, followed by eventual registration number if reconciliation succeeds. [PDF pp. 4, 9, 13, 20] | No confirmed readable help address in the supplied raster; no exact gateway failure/refund path. |
| Payment gateway fails without a registration number or without a deduction | No action is prescribed. | No dedicated failure state is shown. | Retry rules, error text, support SLA, and refund behavior are not stated. |
| Applicant presses browser Refresh/Back during payment | The payment screen says `Do not use Refresh and back button of browser.` | Warning shown on `Online Request Payment Form`. [PDF p. 9 screenshot] | Consequence of pressing it is not stated. |
| Wrong public authority at State Government level | Refile the same request before the concerned State Government public authority. | `RTI REQUEST APPLICATION RETURNED TO APPLICANT`; the manual says no refund, including for Government of NCT, New Delhi. [PDF p. 22] | The manual does not separately define behavior for selecting the wrong Central Government authority. |
| Request transferred to another public authority | Use the new registration number to view status. | `REQUEST TRANSFERRED TO OTHER PUBLIC AUTHORITY`; destination authority details and a new number are shown. Registration code `T` means `Transfer From Other Public Authority`. [PDF pp. 23, 29] | The manual does not cite Section 6(3), define the legal trigger, state a transfer deadline, or explain whether the original and new clocks are linked. |
| Request forwarded to multiple CPIOs | Track each generated registration number separately. If dissatisfied, file the appeal for the particular CPIO/part number. | `Click here to view details`; four-part example has four numbers and four replies. [PDF pp. 24-25] | No rule is given for how the CPIO split is decided or how to combine/compare replies. |
| Unsatisfactory reply from one CPIO in a split request | Appeal against that CPIO's particular registration number, not the original number. | The manual's example says to appeal `DOP&T/R/2013/65132/1`, not `DOP&T/R/2013/65132`. [PDF p. 25] | No First Appeal deadline, decision deadline, or later escalation is given. |
| No reply within the relevant time limit | Select `No Response Within the Time Limit` as `Ground For Appeal` and use the original request registration number in the First Appeal flow. | The reason exists in the dropdown; no automatic prompt or eligibility indicator is described. [PDF pp. 14-16] | The manual does not state the length of the time limit, the clock trigger, or a consequence of missing it. |
| Additional fee demanded for information | Open `Make Payment` from View Status and proceed to the payment gateway. | Status has `Additional Payment`, an amount, a remark, and a `Make Payment` link; the guideline says the CPIO informs the applicant through the portal, status report, or e-mail alert. [PDF pp. 4, 20] | No due date, fee formula, non-payment consequence, or post-payment state is described. |
| Attached document is inaccessible | Re-upload the same document from View Status: `Choose File`, then `Attached`. | `SUPPORTING DOCUMENT REQUIRED FROM APPLICANT ...`, explanatory remarks, upload control, and `File upload successfully`. [PDF p. 21] | No reason codes, rejection state, upload deadline, filename rules, or failed-upload behavior are stated. |
| Request/appeal text exceeds the inline limit | Upload the application/appeal as `Supporting document`. | The request prose says over 3000 characters can be attached; the appeal prose also says over 3000 can be attached. [PDF pp. 7-8, 16] | First Appeal screenshot says 500 characters and counter 0/3000; the manual does not resolve that conflict or say whether the text field may be blank. |
| Invalid character entered in request/appeal text | Use only the listed character set. | The manual prints an allowed-character note. | It does not show the validation error, whether spaces are allowed, or whether `?` is allowed in request text. |
| BPL proof missing/invalid | Attach the BPL card certificate/copy of the appropriate-government certificate in `Supporting document`; submit without the RTI fee. | BPL path shows proof-related fields and a starred supporting-document row. [PDF p. 6] | No validation/rejection/status behavior is documented. |
| First Appeal filed but no decision | The manual only exposes `Pending Appeals` in View History. | No dedicated no-decision screen is shown. [PDF pp. 27-29] | No 45-day clock, escalation instruction, Second Appeal eligibility, or penalty consequence is stated. |
| Second Appeal or complaint needed | The page footer contains the link text `Complaint & Second Appeal to CIC`. | No Second Appeal form or flow is described in the manual. | No 90-day deadline, trigger, required fields, or status lifecycle is supplied. |
| Mobile number omitted | The citizen can still submit; SMS alerts are conditional on providing a mobile number. | The manual says SMS is sent if a mobile number is provided; e-mail is shown as part of successful submission notification. [PDF pp. 6, 11] | It does not state whether every e-mail is delivered or how alerts are retried. |
| View History identity/OTP mismatch | Enter the e-mail ID and mobile number used earlier to file the request/appeal, security code, then OTP and submit. | The first screen asks `Enter Email Id (For receiving OTP)`, `Mobile Number`, and `Enter Security code`. The next screen's screenshot labels the OTP `(Received in Email ONLY)`, while the prose says OTP is received in `email & Mobile Number`. [PDF pp. 26-27] | The manual does not resolve whether OTP is sent by e-mail only or by both channels, or how a changed mobile number is handled. |

### Explicit omissions relevant to escalation

- The manual does not explain a central-authority mis-selection beyond the general transfer example.
- It does not say whether a returned request can be edited/reused in the portal; it only says to file it before the concerned State Government authority.
- It does not state whether a successful additional-fee payment changes `Pending`, `Disposed of`, or any other status.
- It does not state whether registration numbers are sent by both e-mail and SMS in every branch, although it says e-mail and conditional SMS on submission.
- It does not describe a formal grievance, complaint, First Appeal decision, Second Appeal, or penalty-tracking state.

## 7. Gaps for the Redesign

The manual leaves the citizen to track or infer all of the following. These are redesign opportunities, not claims that the manual supplies the underlying legal rule:

- Start and monitor the PIO/CPIO response clock, the First Appeal decision clock, and any Second Appeal filing window. The familiar 30/45/90-day numbers are not in this manual and must be separately verified before being implemented.
- Explain the clock trigger and ownership when a request is routed through a Nodal Officer, transferred, split among CPIOs, or paused for additional information/fees. The manual shows the routing but gives no clock semantics.
- Detect `No Response Within the Time Limit`, show why the citizen is eligible for a First Appeal, and offer the correct original/part registration number.
- Preserve and group the original, transferred, and multiple-CPIO registration numbers so the citizen does not lose the number that controls a particular reply or appeal.
- Warn before payment when the selected authority is outside the described Central Government scope, because a State Government request is returned without refund.
- Track the 24-48-working-hour payment reconciliation window, explain that registration may arrive later, prevent duplicate payment/registration attempts, and provide a clearly verified support contact.
- Surface attachment accessibility problems, the exact document requested for re-upload, any deadline, and the result of the `Attached` action.
- Show additional-fee amount, calculation/source, due date, payment result, and what happens if the applicant does not pay. None of those details is defined in the manual.
- Make `Pending Requests` and `Pending Appeals` actionable by showing last action, next citizen action, next legally verified deadline, and escalation eligibility instead of only a bucket label.
- Add a separately sourced Section 20 penalty tracker: potential trigger, responsible authority, proceeding state, calculation/cap, and whether the applicant has been informed. The manual does not say any of this or whether the applicant is ever told penalty status.
- Make notification coverage explicit: e-mail is required in the form, mobile is optional for SMS, and the View History OTP channel is internally inconsistent in the manual.
- Preserve the portal's concrete evidence fields - registration number, date of filing, date of action, status, reply/remarks, CPIO/Appellate Authority/Nodal Officer details, and attached documents - so accountability is based on an auditable timeline rather than an opaque status label.
