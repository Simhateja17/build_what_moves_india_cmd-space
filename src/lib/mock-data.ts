import { RtiCase } from "./types";

/**
 * Six seeded cases, each authored as a *story over time* rather than a
 * frozen state — the time machine on the detail page plays them forward.
 * Between them they cover every state the dashboard has to render:
 * waiting, ignored, split, answered, under appeal, and closed.
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
      cpio: "Shri D. Venkatesh, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    submittedOn: "2026-08-09",
    startDay: 18,
    maxDay: 90,
    demoNote: "They answered inside the deadline. Their reply is waiting for you.",
    replyDay: 18,
    reply:
      "Allocation for FPS 114/B for January–July 2026 was 42.5 MT of rice and 18.0 MT of wheat. Actual lifting was 38.1 MT and 15.4 MT respectively. The shortfall of 4.4 MT and 2.6 MT is attributed to transport contractor default in March and May 2026. A show-cause notice was issued to the contractor on 02/06/2026.",
    events: [
      { day: 0, kind: "filed", plain: "You filed this request and paid ₹10", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer passed it to the CPIO who must answer you", official: "TRANSMITTED TO CPIO" },
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
      cpio: "Shri A. Ramesh, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    submittedOn: "2026-08-21",
    startDay: 6,
    maxDay: 40,
    demoNote: "A normal request, still inside the legal 30-day window.",
    replyDay: 22,
    reply:
      "The pension case file PPO-2019/44871 was returned to the Pay & Accounts Office on 14/02/2026 for revision of the qualifying-service certificate. Revised sanction is expected within 30 days. The file is currently with Shri M. Iyer, Assistant Accounts Officer.",
    notices: [
      {
        day: 4,
        kind: "document_requested",
        plain:
          "The office has asked you to upload proof that you are the pensioner's son, so they can release personal details to you",
        official: "ADDITIONAL DOCUMENT SOUGHT — S.7(1) PROVISO",
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "You filed this request and paid ₹10", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer passed it to the CPIO who must answer you", official: "TRANSMITTED TO CPIO" },
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
      cpio: "Shri R. Subramaniam, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    submittedOn: "2026-07-24",
    startDay: 34,
    maxDay: 120,
    demoNote:
      "They went silent. The deadline has passed, so a penalty is running against the officer.",
    // No replyDay — this office never answers. That is the point.
    events: [
      { day: 0, kind: "filed", plain: "You filed this request and paid ₹10", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      { day: 3, kind: "cpio", plain: "The Nodal Officer passed it to the CPIO who must answer you", official: "TRANSMITTED TO CPIO" },
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
      cpio: "Smt. P. Bhattacharya, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
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
          "The Appellate Authority has fixed a hearing on your appeal. You may attend in person or by video, and you may also choose not to attend",
        official: "FIRST APPEAL — HEARING FIXED",
        hearingDay: 60,
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "You filed this request and paid ₹10", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer passed it to the CPIO who must answer you", official: "TRANSMITTED TO CPIO" },
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
      cpio: "Smt. K. Nair, CPIO",
    },
    feeLabel: "Fee waived — BPL certificate attached",
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
          "Part of your question belonged to two other offices, so it was moved to them. The law gives them the same 30 days from the day they received it",
        official: "TRANSFERRED UNDER S.6(3)",
      },
    ],
    events: [
      { day: 0, kind: "filed", plain: "You filed this request — no fee, as you hold a BPL card", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      {
        day: 2,
        kind: "split",
        plain:
          "Your question spanned three offices, so it was split into three separate requests — each got its own registration number",
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
      cpio: "Dr. S. Menon, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    submittedOn: "2026-08-01",
    startDay: 26,
    maxDay: 60,
    demoNote: "Asked, answered, and closed — what the process looks like when it works.",
    replyDay: 12,
    reply:
      "Against a sanctioned strength of 64 medical officer posts at the District General Hospital, 41 are filled and 23 are vacant as on 01/07/2026. The vacancies comprise 9 general duty medical officers, 6 specialists in anaesthesia, 4 in paediatrics, and 4 in general surgery. Recruitment for 18 of these posts is under process through the State Public Service Commission.",
    events: [
      { day: 0, kind: "filed", plain: "You filed this request and paid ₹10", official: "REGISTERED" },
      { day: 0, kind: "routed", plain: "It reached the department's Nodal Officer", official: "FORWARDED TO NODAL OFFICER" },
      { day: 2, kind: "cpio", plain: "The Nodal Officer passed it to the CPIO who must answer you", official: "TRANSMITTED TO CPIO" },
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
