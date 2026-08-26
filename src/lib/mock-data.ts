import { RtiRequest } from "./types";

/**
 * Fixed, pre-seeded demo data — deliberately not derived from real timestamps,
 * so the three edge-case states are reliable to demo regardless of when the
 * judges open the link.
 */
export const SEED_REQUESTS: RtiRequest[] = [
  {
    id: "req-fresh",
    registrationNumber: "DLRD1/R/E/26/00842",
    plainTitle: "Status of my father's pension file",
    officialSummary:
      "Request for information regarding the processing status of pension case file.",
    authority: {
      ministry: "Ministry of Rural Development",
      department: "Department of Land Resources",
    },
    filedDayLabel: "Filed 5 days ago",
    daysElapsed: 5,
    deadlineDays: 30,
    status: "awaiting_reply",
    history: [
      { day: "Day 0", plainLabel: "You filed this request", officialLabel: "REGISTERED" },
      {
        day: "Day 0",
        plainLabel: "Sent to the department's Nodal Officer",
        officialLabel: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: "Day 1",
        plainLabel: "Forwarded to the officer who handles this (the CPIO)",
        officialLabel: "TRANSMITTED TO CPIO",
      },
      {
        day: "Day 5",
        plainLabel: "Still waiting — 25 days left before they must reply",
      },
    ],
  },
  {
    id: "req-overdue",
    registrationNumber: "MORT2/R/E/26/01193",
    plainTitle: "Records of road repair funds spent in my ward",
    officialSummary:
      "Request for expenditure records relating to road repair works sanctioned in the applicant's municipal ward.",
    authority: {
      ministry: "Ministry of Road Transport and Highways",
      department: "Public Works Division",
      nodalOfficer: "R. Subramaniam",
    },
    filedDayLabel: "Filed 34 days ago",
    daysElapsed: 34,
    deadlineDays: 30,
    status: "no_response_overdue",
    history: [
      { day: "Day 0", plainLabel: "You filed this request", officialLabel: "REGISTERED" },
      {
        day: "Day 0",
        plainLabel: "Sent to the department's Nodal Officer",
        officialLabel: "FORWARDED TO NODAL OFFICER",
      },
      {
        day: "Day 2",
        plainLabel: "Forwarded to the officer who handles this (the CPIO)",
        officialLabel: "TRANSMITTED TO CPIO",
      },
      {
        day: "Day 30",
        plainLabel: "Legal deadline passed with no reply",
        officialLabel: "NO REPLY RECEIVED — DEEMED REFUSAL",
      },
      {
        day: "Day 34",
        plainLabel: "Still no reply — you're now entitled to escalate",
        officialLabel: "ELIGIBLE FOR FIRST APPEAL",
      },
    ],
    penalty: {
      active: true,
      ratePerDayInr: 250,
      capInr: 25000,
      daysOverdue: 4,
      accruedInr: 1000,
    },
  },
  {
    id: "req-split",
    registrationNumber: "MOED3/R/E/26/00267",
    plainTitle: "Scholarship disbursal records for my district",
    officialSummary:
      "Request for disbursal records of scheduled-caste scholarship funds for the applicant's district, forwarded across multiple public authorities.",
    authority: {
      ministry: "Ministry of Education",
      department: "Department of School Education & Literacy",
    },
    filedDayLabel: "Filed 18 days ago",
    daysElapsed: 18,
    deadlineDays: 30,
    status: "awaiting_reply",
    history: [
      { day: "Day 0", plainLabel: "You filed this request", officialLabel: "REGISTERED" },
      {
        day: "Day 2",
        plainLabel:
          "Your request covered 3 different offices, so it was split into 3 parts — each is now tracked separately",
        officialLabel: "REQUEST FORWARDED TO MULTIPLE CPIOs",
      },
    ],
    parts: [
      {
        id: "req-split-1",
        registrationNumber: "MOED3/R/E/26/00267/1",
        plainLabel: "Part 1 — State Directorate of Education",
        status: "replied",
        reply:
          "District-wise disbursal figures for FY 2025-26 attached, covering January to June.",
      },
      {
        id: "req-split-2",
        registrationNumber: "MOED3/R/E/26/00267/2",
        plainLabel: "Part 2 — District Education Office",
        status: "awaiting_reply",
      },
      {
        id: "req-split-3",
        registrationNumber: "MOED3/R/E/26/00267/3",
        plainLabel: "Part 3 — University Grants Cell",
        status: "no_response_overdue",
      },
    ],
  },
];
