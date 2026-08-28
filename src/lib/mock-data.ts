import { Applicant, FeeRecord, RtiCase } from "./types";

/**
 * The applicant, as every one of these offices holds her.
 *
 * The detail page shows this back to the citizen. A wrong address on the
 * record is the commonest reason a reply never arrives, and the person
 * who filed is the only one in a position to notice it.
 */
export const SEED_APPLICANT: Applicant = {
  name: "Ananya Sharma",
  address: "14/2, Second Cross Street, Nungambakkam, Chennai 600034",
  email: "ananya.sharma@example.in",
  mobile: "+91 98407 44120",
  isCitizen: true,
  isBpl: false,
};

/** The ₹10 that was actually paid, with the receipt that proves it. */
function paidFee(receiptNumber: string, paidOn: string): FeeRecord {
  return {
    amountInr: 10,
    waived: false,
    mode: "UPI",
    receiptNumber,
    paidOn,
  };
}

/**
 * No fee at all — s.7(5) proviso. A person below the poverty line pays
 * nothing, and the basis of the waiver belongs on the record so that no
 * office can later ask for money it is not entitled to.
 */
function waivedFee(waiverBasis: string): FeeRecord {
  return { amountInr: 0, waived: true, waiverBasis };
}

/**
 * Eight seeded cases, each authored as a *story over time* rather than a
 * frozen state — the time machine on the detail page plays them forward.
 * Between them they cover every state the dashboard has to render:
 * waiting, ignored, split, answered, refused on an exemption, under
 * appeal, out of appeal and bound for the Commission, and closed.
 *
 * Registration numbers follow the portal's real
 * AAAAA/B/C/DD/EEEEE format (authority / R-or-A / receipt type / year / serial).
 * Submission dates are anchored so that each case's start day lands on
 * the present — the dashboard opens on a plausible today.
 */
export const SEED_CASES: RtiCase[] = [
  {
    id: "ration",
    registrationNumber: "DOFPD/R/E/26/03310",
    plainTitle: "Ration that never arrived at our fair price shop",
    subject: "Ration shop supply records",
    question:
      "Please provide the monthly allocation and actual delivery records for fair price shop no. 114/B for the period January to July 2026, along with the reasons recorded for any shortfall.",
    authority: {
      ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
      office: "Department of Food & Public Distribution",
      cpio: {
        name: "Shri D. Venkatesh",
        designation: "Under Secretary (PD-I) & Central Public Information Officer",
        address: "Room 384, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi 110001",
        email: "cpio-pd@dfpd.gov.in",
        phone: "011 2338 2401",
      },
      appellateAuthority: {
        name: "Smt. R. Anandavalli",
        designation: "Director (Public Distribution) & First Appellate Authority",
        address: "Room 490, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi 110001",
        email: "aa-pd@dfpd.gov.in",
        phone: "011 2338 2477",
      },
    },
    fee: paidFee("RTI/DOFPD/26/118842", "2026-08-09"),
    applicant: SEED_APPLICANT,
    format: "electronic",
    // The records ran to 137 pages, so the office asked for the cost of
    // copying them — and the clock stopped for the three days it took to
    // pay, exactly as s.7(3)(a) requires.
    additionalFee: {
      day: 6,
      amountInr: 274,
      calculation: "137 pages at ₹2 per page (RTI Rules, 2012, rule 4).",
      paidOnDay: 9,
    },
    submittedOn: "2026-08-09",
    startDay: 18,
    maxDay: 90,
    demoNote:
      "They answered inside the deadline. They also charged for the photocopies, which stopped the clock for three days.",
    replyDay: 18,
    decision: { outcome: "provided" },
    reply:
      "Allocation for FPS 114/B for January–July 2026 was 42.5 MT of rice and 18.0 MT of wheat. Actual lifting was 38.1 MT and 15.4 MT respectively. The shortfall of 4.4 MT and 2.6 MT is attributed to transport contractor default in March and May 2026. A show-cause notice was issued to the contractor on 02/06/2026.",
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "pension",
    registrationNumber: "DOPPW/R/E/26/00842",
    plainTitle: "Why my father's pension has been stuck for 7 months",
    subject: "Pension file stuck since January",
    question:
      "Please provide the current status of pension case file no. PPO-2019/44871, the reason for the delay in disbursal since January, and the name and designation of the officer currently holding the file.",
    authority: {
      ministry: "Ministry of Personnel, Public Grievances & Pensions",
      office: "Department of Pension & Pensioners' Welfare",
      cpio: {
        name: "Shri A. Ramesh",
        designation: "Deputy Secretary (P&PW-B) & Central Public Information Officer",
        address: "Room 311, Lok Nayak Bhawan, Khan Market, New Delhi 110003",
        email: "cpio-doppw@nic.in",
        phone: "011 2464 4632",
      },
      appellateAuthority: {
        name: "Shri V. Sundararajan",
        designation: "Joint Secretary (Pension) & First Appellate Authority",
        address: "Room 302, Lok Nayak Bhawan, Khan Market, New Delhi 110003",
        email: "aa-doppw@nic.in",
        phone: "011 2464 4610",
      },
    },
    fee: paidFee("RTI/DOPPW/26/009431", "2026-08-21"),
    applicant: SEED_APPLICANT,
    format: "electronic",
    // The file holds the pensioner's own particulars, so the office had
    // to put the third party on notice and hear them before deciding.
    // That is s.11(3), and it buys forty days, not thirty.
    track: "third_party",
    submittedOn: "2026-08-21",
    startDay: 6,
    maxDay: 70,
    demoNote:
      "A normal request, still inside its window — which is forty days here, not thirty, because a third party had to be heard first.",
    replyDay: 22,
    decision: { outcome: "provided" },
    reply:
      "The pension case file PPO-2019/44871 was returned to the Pay & Accounts Office on 14/02/2026 for revision of the qualifying-service certificate. Revised sanction is expected within 30 days. The file is currently with Shri M. Iyer, Assistant Accounts Officer.",
    notices: [
      {
        day: 4,
        kind: "document_requested",
        plain:
          "The office has requested documentary proof that you are the pensioner's son, before personal details can be released to you",
        official: "ADDITIONAL DOCUMENT SOUGHT — S.7(1) PROVISO",
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "roads",
    registrationNumber: "MORTH/R/E/26/01193",
    plainTitle: "How ₹4.2 crore of road repair money was spent in my ward",
    subject: "Road repair spending in Ward 14",
    question:
      "Please provide the tender documents, contractor names, sanctioned amounts and completion certificates for all road repair works carried out in Ward 14 between April 2025 and March 2026.",
    authority: {
      ministry: "Ministry of Road Transport & Highways",
      office: "Public Works Division, Ward 14",
      cpio: {
        name: "Shri R. Subramaniam",
        designation: "Executive Engineer & Central Public Information Officer",
        address: "Divisional Office, Public Works Division, Ward 14 Civic Centre, Anna Salai, Chennai 600002",
        email: "cpio.pwd14@tn.gov.in",
        phone: "044 2851 7730",
      },
      appellateAuthority: {
        name: "Shri G. Mohan Raj",
        designation: "Superintending Engineer (Highways Circle) & First Appellate Authority",
        address: "Highways Circle Office, Chepauk, Chennai 600005",
        email: "aa.highways@tn.gov.in",
        phone: "044 2854 1108",
      },
    },
    fee: paidFee("RTI/MORTH/26/077310", "2026-07-24"),
    applicant: SEED_APPLICANT,
    format: "printed",
    submittedOn: "2026-07-24",
    startDay: 34,
    maxDay: 120,
    demoNote:
      "They went silent. The deadline has passed, so a penalty is running against the officer.",
    // No replyDay — this office never answers. That is the point.
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 3, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "landrecord",
    registrationNumber: "MORDV/R/E/26/00915",
    plainTitle: "Why my land mutation has not moved in eleven months",
    subject: "Land mutation record delay",
    question:
      "Please provide the current status of mutation application no. MUT/2025/8841, the date it was last acted upon, and the name of every officer who has held the file since submission.",
    authority: {
      ministry: "Ministry of Rural Development",
      office: "Department of Land Resources",
      cpio: {
        name: "Smt. P. Bhattacharya",
        designation: "Under Secretary (Land Records) & Central Public Information Officer",
        address: "Room 274, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi 110001",
        email: "cpio-dolr@nic.in",
        phone: "011 2338 3553",
      },
      appellateAuthority: {
        name: "Shri Harish Chandra Meena",
        designation: "Director (Land Reforms) & First Appellate Authority",
        address: "Room 258, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi 110001",
        email: "aa-dolr@nic.in",
        phone: "011 2338 3571",
      },
    },
    fee: paidFee("RTI/MORDV/26/004417", "2026-07-06"),
    applicant: SEED_APPLICANT,
    format: "electronic",
    submittedOn: "2026-07-06",
    startDay: 52,
    maxDay: 140,
    demoNote:
      "They ignored it, you appealed, and the Appellate Authority has scheduled a hearing.",
    notices: [
      {
        day: 47,
        kind: "hearing_scheduled",
        plain:
          "The Appellate Authority has fixed a hearing on your appeal. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone",
        official: "FIRST APPEAL — HEARING FIXED",
        hearingDay: 60,
        hearingTime: "11:30 AM",
        hearingMode: "hybrid",
        hearingVenue:
          "Conference Room, Second Floor, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi 110001",
        hearingLink: "vc.nic.in/dolr-rti/fa2291",
        hearingBefore:
          "Shri Harish Chandra Meena, Director (Land Reforms) & First Appellate Authority",
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "passport",
    registrationNumber: "MOEAF/R/E/26/01764",
    plainTitle: "Why my police verification has been pending for five months",
    subject: "Passport police verification file",
    question:
      "Please provide the date on which the police verification report for passport file no. PV/2026/11209 was received by the Regional Passport Office, the officer who examined it, and the reason recorded for holding the file since then.",
    authority: {
      ministry: "Ministry of External Affairs",
      office: "Regional Passport Office",
      cpio: {
        name: "Shri N. Krishnamurthy",
        designation: "Assistant Passport Officer & Central Public Information Officer",
        address: "Regional Passport Office, Royala Towers, 158 Anna Salai, Chennai 600002",
        email: "cpio.chennai@mea.gov.in",
        phone: "044 2861 5000",
      },
      appellateAuthority: {
        name: "Smt. Lalitha Venugopal",
        designation: "Regional Passport Officer & First Appellate Authority",
        address: "Regional Passport Office, Royala Towers, 158 Anna Salai, Chennai 600002",
        email: "rpo.chennai@mea.gov.in",
        phone: "044 2861 5001",
      },
    },
    fee: paidFee("RTI/MOEAF/26/031277", "2026-07-19"),
    applicant: SEED_APPLICANT,
    format: "electronic",
    submittedOn: "2026-07-19",
    startDay: 40,
    maxDay: 130,
    demoNote:
      "They replied inside the deadline, but refused the part that mattered. A reply is not the same as an answer — you can appeal this.",
    replyDay: 26,
    replyIsRefusal: true,
    decision: {
      outcome: "rejected",
      exemptions: ["8(1)(g)"],
      reasons:
        "The file forms part of a police verification carried out for the purpose of law enforcement. Disclosure of its contents, including the identity of the reporting officers, would endanger the safety of persons who furnish information in confidence.",
      withheld:
        "The whole application, including the date the report was received and the name of the officer who examined it.",
      // Nothing on the record shows the officer weighed the public
      // interest in disclosure against the harm, which s.8(2) requires
      // them to do. The page says so rather than leaving it blank.
      publicInterestConsidered: false,
    },
    reply:
      "The information sought is exempt under section 8(1)(g) of the RTI Act, 2005, as disclosure would endanger the safety of persons furnishing information for law enforcement purposes. The application is accordingly disposed of.",
    refusalGrounds:
      "The office claimed a blanket exemption over the whole application. It did not answer the date the report was received, which is a plain administrative fact and cannot endanger anyone. It named no officer, and it did not explain how the public interest in withholding outweighs the interest in disclosure, as section 8(2) requires.",
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "mgnrega",
    registrationNumber: "MORDV/R/E/26/00488",
    plainTitle: "Wages our village never received for 96 days of work",
    subject: "Unpaid MGNREGA wages, 2025-26",
    question:
      "Please provide the muster rolls, wage payment orders and dates of credit for job card holders under works sanctioned in Gram Panchayat Kadamberi for the financial year 2025-26, and the reason recorded for any payment delayed beyond fifteen days.",
    authority: {
      ministry: "Ministry of Rural Development",
      office: "MGNREGA Cell",
      cpio: {
        name: "Shri T. Balasubramanian",
        designation: "Programme Officer (MGNREGA) & Central Public Information Officer",
        address: "Block Development Office, Kadamberi Block, Tiruvallur District 602001",
        email: "cpio.mgnrega.tvl@tn.gov.in",
        phone: "044 2766 2214",
      },
      appellateAuthority: {
        name: "Shri K. Elangovan",
        designation: "District Programme Coordinator (Collector) & First Appellate Authority",
        address: "Office of the District Collector, Tiruvallur 602001",
        email: "collr.tvl@tn.gov.in",
        phone: "044 2766 2000",
      },
    },
    fee: waivedFee("BPL ration card no. TN/33/PHH/0448127, copy enclosed with the application."),
    applicant: { ...SEED_APPLICANT, isBpl: true },
    format: "printed",
    submittedOn: "2026-03-14",
    startDay: 96,
    maxDay: 220,
    demoNote:
      "They stayed silent, the appeal was ignored too, and the 45 days ran out. The department has had its chances — this one leaves the building.",
    // No replyDay, and the Appellate Authority never decides either. That
    // is the whole point: the escape hatch is the Information Commission.
    events: [
      { day: 0, kind: "filed", plain: "The application was filed. No fee was charged, as a BPL certificate was submitted.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 3, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
  {
    id: "scholarship",
    registrationNumber: "MOEDU/R/E/26/00267",
    plainTitle: "Scholarship money that never reached students in my district",
    subject: "Post-matric scholarship disbursal",
    question:
      "Please provide district-wise disbursal records of post-matric scholarship funds for SC/ST students for FY 2025-26, including the number of applications rejected and the reasons for rejection.",
    authority: {
      ministry: "Ministry of Education",
      office: "Department of School Education & Literacy",
      cpio: {
        name: "Smt. K. Nair",
        designation: "Under Secretary (Scholarships) & Central Public Information Officer",
        address: "Room 508, C Wing, Shastri Bhawan, New Delhi 110001",
        email: "cpio.dsel@education.gov.in",
        phone: "011 2338 6451",
      },
      appellateAuthority: {
        name: "Shri Prashant Deshmukh",
        designation: "Director (Scholarships) & First Appellate Authority",
        address: "Room 514, C Wing, Shastri Bhawan, New Delhi 110001",
        email: "aa.dsel@education.gov.in",
        phone: "011 2338 6470",
      },
    },
    fee: waivedFee("BPL ration card no. TN/33/PHH/0448127, copy enclosed with the application."),
    applicant: { ...SEED_APPLICANT, isBpl: true },
    format: "electronic",
    submittedOn: "2026-08-07",
    startDay: 20,
    maxDay: 90,
    demoNote:
      "One request, silently split across three offices — each with its own number and its own clock.",
    notices: [
      {
        day: 2,
        kind: "transferred",
        plain:
          "Part of this application concerned two other offices and has been transferred to them. Each office has 30 days to respond, counted from the date of receipt",
        official: "TRANSFERRED UNDER S.6(3)",
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "The application was filed. No fee was charged, as a BPL certificate was submitted.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      {
        day: 2,
        kind: "split",
        plain:
          "This application concerned three offices and was split into three separate requests, each with its own registration number",
        official: "FORWARDED TO MULTIPLE CPIOs",
      },
    ],
    parts: [
      {
        id: "scholarship-1",
        registrationNumber: "MOEDU/R/E/26/00267/1",
        office: "State Directorate of Education",
        replyDay: 16,
        reply:
          "District-wise disbursal figures for FY 2025-26 are enclosed for the period April to September 2025. Figures for the remaining months are awaited from the treasury.",
      },
      {
        id: "scholarship-2",
        registrationNumber: "MOEDU/R/E/26/00267/2",
        office: "District Education Office",
        replyDay: 44,
        reply:
          "A total of 1,284 applications were received, of which 212 were rejected. The reason recorded in 189 of those cases is 'incomplete bank details'.",
      },
      {
        id: "scholarship-3",
        registrationNumber: "MOEDU/R/E/26/00267/3",
        office: "University Grants Cell",
        // Never replies — the part that quietly rots while the others close.
      },
    ],
  },
  {
    id: "hospital",
    registrationNumber: "MOHFW/R/E/26/02048",
    plainTitle: "How many doctor posts are lying vacant at our district hospital",
    subject: "Vacant doctor posts, district hospital",
    question:
      "Please provide the sanctioned strength, the number of posts currently filled, and the number of posts vacant for each category of medical officer at the District General Hospital as on 1 July 2026.",
    authority: {
      ministry: "Ministry of Health & Family Welfare",
      office: "National Health Mission",
      cpio: {
        name: "Dr. S. Menon",
        designation: "Deputy Commissioner (NHM-I) & Central Public Information Officer",
        address: "Room 704, D Wing, Nirman Bhawan, Maulana Azad Road, New Delhi 110011",
        email: "cpio.nhm@mohfw.gov.in",
        phone: "011 2306 3223",
      },
      appellateAuthority: {
        name: "Dr. Anuradha Kulkarni",
        designation: "Additional Commissioner (NHM) & First Appellate Authority",
        address: "Room 711, D Wing, Nirman Bhawan, Maulana Azad Road, New Delhi 110011",
        email: "aa.nhm@mohfw.gov.in",
        phone: "011 2306 3240",
      },
    },
    fee: paidFee("RTI/MOHFW/26/205518", "2026-08-01"),
    applicant: SEED_APPLICANT,
    format: "electronic",
    submittedOn: "2026-08-01",
    startDay: 26,
    maxDay: 60,
    demoNote: "Asked, answered, and closed — what the process looks like when it works.",
    replyDay: 12,
    decision: { outcome: "provided" },
    reply:
      "Against a sanctioned strength of 64 medical officer posts at the District General Hospital, 41 are filled and 23 are vacant as on 01/07/2026. The vacancies comprise 9 general duty medical officers, 6 specialists in anaesthesia, 4 in paediatrics, and 4 in general surgery. Recruitment for 18 of these posts is under process through the State Public Service Commission.",
    events: [
      { day: 0, kind: "filed", plain: "The application was filed, with the ₹10 fee paid.", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "The application reached the department's Nodal Officer.", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer forwarded the application to the CPIO responsible for reply.", official: "TRANSMITTED TO CPIO" },
    ],
  },
];

/**
 * One appeal already in flight, so the dashboard has a real
 * RTI → appeal relationship to show rather than an empty section.
 */
export const SEED_APPEALS: Record<
  string,
  { filedOnDay: number; ground: string; number: string }
> = {
  landrecord: {
    filedOnDay: 38,
    ground: "No Response Within the Time Limit",
    number: "FA2291",
  },
  // Filed on day 40, so the Authority's 45 days expired on day 85. The
  // case opens on day 96 — eleven days into a silence the Act has no
  // further remedy for, short of the Information Commission.
  mgnrega: {
    filedOnDay: 40,
    ground: "No Response Within the Time Limit",
    number: "FA1806",
  },
};

/** Responses the citizen has already opened. Everything else reads as new. */
export const SEED_READ_RESPONSES = ["hospital"];

export const MINISTRIES = [
  "Ministry of Personnel, Public Grievances & Pensions",
  "Ministry of Road Transport & Highways",
  "Ministry of Education",
  "Ministry of Health & Family Welfare",
  "Ministry of Railways",
  "Ministry of Rural Development",
  "Ministry of Consumer Affairs, Food & Public Distribution",
  "Department of Posts",
  "Ministry of Housing & Urban Affairs",
  "Ministry of External Affairs",
];

export const OFFICES: Record<string, string[]> = {
  "Ministry of Personnel, Public Grievances & Pensions": [
    "Department of Pension & Pensioners' Welfare",
    "Department of Personnel & Training",
  ],
  "Ministry of Road Transport & Highways": [
    "National Highways Authority of India",
    "Public Works Division",
    "Regional Transport Office",
  ],
  "Ministry of Education": [
    "Department of School Education & Literacy",
    "Department of Higher Education",
    "University Grants Commission",
    "Kendriya Vidyalaya Sangathan",
    "Navodaya Vidyalaya Samiti",
  ],
  "Ministry of Health & Family Welfare": [
    "National Health Mission",
    "Central Government Health Scheme",
    "All India Institute of Medical Sciences (AIIMS)",
    "Employees' State Insurance Corporation (ESIC)",
  ],
  "Ministry of Railways": ["Zonal Railway Office", "Railway Recruitment Board"],
  "Ministry of Rural Development": [
    "Department of Land Resources",
    "MGNREGA Cell",
  ],
  "Ministry of Consumer Affairs, Food & Public Distribution": [
    "Department of Food & Public Distribution",
    "Department of Consumer Affairs",
    "Food Corporation of India",
  ],
  "Department of Posts": ["Circle Office", "Head Post Office"],
  "Ministry of Housing & Urban Affairs": [
    "Municipal Corporation",
    "Urban Development Authority",
  ],
  "Ministry of External Affairs": [
    "Regional Passport Office",
    "Central Passport Organisation",
  ],
};

/** Short authority code used in the AAAAA slot of a registration number. */
export const MINISTRY_CODES: Record<string, string> = {
  "Ministry of Personnel, Public Grievances & Pensions": "DOPPW",
  "Ministry of Road Transport & Highways": "MORTH",
  "Ministry of Education": "MOEDU",
  "Ministry of Health & Family Welfare": "MOHFW",
  "Ministry of Railways": "MORLY",
  "Ministry of Rural Development": "MORDV",
  "Ministry of Consumer Affairs, Food & Public Distribution": "DOFPD",
  "Department of Posts": "DOPST",
  "Ministry of Housing & Urban Affairs": "MOHUA",
  "Ministry of External Affairs": "MOEAF",
};
