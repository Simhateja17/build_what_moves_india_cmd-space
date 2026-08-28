import { RtiCase } from "./types";

/**
 * Three seeded cases, each authored as a *story over time* rather than a
 * frozen state — the time machine on the detail page plays them forward.
 * Registration numbers follow the portal's real
 * AAAAA/B/C/DD/EEEEE format (authority / R-or-A / receipt type / year / serial).
 */
export const SEED_CASES: RtiCase[] = [
  {
    id: "pension",
    registrationNumber: "DOPPW/R/E/26/00842",
    plainTitle: "Why my father's pension has been stuck for 7 months",
    question:
      "Please provide the current status of pension case file no. PPO-2019/44871, the reason for the delay in disbursal since January, and the name and designation of the officer currently holding the file.",
    authority: {
      ministry: "Ministry of Personnel, Public Grievances & Pensions",
      office: "Department of Pension & Pensioners' Welfare",
      cpio: "Shri A. Ramesh, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    startDay: 6,
    maxDay: 40,
    demoNote: "A normal request, still inside the legal 30-day window.",
    replyDay: 22,
    reply:
      "The pension case file PPO-2019/44871 was returned to the Pay & Accounts Office on 14/02/2026 for revision of the qualifying-service certificate. Revised sanction is expected within 30 days. The file is currently with Shri M. Iyer, Assistant Accounts Officer.",
    events: [
      {
        day: 0,
        kind: "filed",
        plain: "You filed this request and paid ₹10",
        official: "REGISTERED",
      },
      {
        day: 0,
        kind: "routed",
        plain: "It reached the department's Nodal Officer",
        official: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: 2,
        kind: "cpio",
        plain: "The Nodal Officer passed it to the CPIO who must answer you",
        official: "TRANSMITTED TO CPIO",
      },
    ],
  },
  {
    id: "roads",
    registrationNumber: "MORTH/R/E/26/01193",
    plainTitle: "How ₹4.2 crore of road repair money was spent in my ward",
    question:
      "Please provide the tender documents, contractor names, sanctioned amounts and completion certificates for all road repair works carried out in Ward 14 between April 2025 and March 2026.",
    authority: {
      ministry: "Ministry of Road Transport & Highways",
      office: "Public Works Division, Ward 14",
      cpio: "Shri R. Subramaniam, CPIO",
    },
    feeLabel: "₹10 paid by UPI",
    startDay: 34,
    maxDay: 120,
    demoNote:
      "They went silent. The deadline has passed, so a penalty is running against the officer.",
    // No replyDay — this office never answers. That is the point.
    events: [
      {
        day: 0,
        kind: "filed",
        plain: "You filed this request and paid ₹10",
        official: "REGISTERED",
      },
      {
        day: 0,
        kind: "routed",
        plain: "It reached the department's Nodal Officer",
        official: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: 3,
        kind: "cpio",
        plain: "The Nodal Officer passed it to the CPIO who must answer you",
        official: "TRANSMITTED TO CPIO",
      },
    ],
  },
  {
    id: "scholarship",
    registrationNumber: "MOEDU/R/E/26/00267",
    plainTitle: "Scholarship money that never reached students in my district",
    question:
      "Please provide district-wise disbursal records of post-matric scholarship funds for SC/ST students for FY 2025-26, including the number of applications rejected and the reasons for rejection.",
    authority: {
      ministry: "Ministry of Education",
      office: "Department of School Education & Literacy",
      cpio: "Smt. K. Nair, CPIO",
    },
    feeLabel: "Fee waived — BPL certificate attached",
    startDay: 20,
    maxDay: 90,
    demoNote:
      "One request, silently split across three offices — each with its own number and its own clock.",
    events: [
      {
        day: 0,
        kind: "filed",
        plain: "You filed this request — no fee, as you hold a BPL card",
        official: "REGISTERED",
      },
      {
        day: 0,
        kind: "routed",
        plain: "It reached the department's Nodal Officer",
        official: "FORWARDED TO NODAL OFFICER",
      },
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
];

export const MINISTRIES = [
  "Ministry of Personnel, Public Grievances & Pensions",
  "Ministry of Road Transport & Highways",
  "Ministry of Education",
  "Ministry of Health & Family Welfare",
  "Ministry of Railways",
  "Ministry of Rural Development",
  "Department of Posts",
  "Ministry of Housing & Urban Affairs",
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
  ],
  "Ministry of Health & Family Welfare": [
    "National Health Mission",
    "Central Government Health Scheme",
  ],
  "Ministry of Railways": ["Zonal Railway Office", "Railway Recruitment Board"],
  "Ministry of Rural Development": [
    "Department of Land Resources",
    "MGNREGA Cell",
  ],
  "Department of Posts": ["Circle Office", "Head Post Office"],
  "Ministry of Housing & Urban Affairs": [
    "Municipal Corporation",
    "Urban Development Authority",
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
  "Department of Posts": "DOPST",
  "Ministry of Housing & Urban Affairs": "MOHUA",
};
