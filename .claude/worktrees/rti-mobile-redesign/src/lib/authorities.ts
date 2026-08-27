import { MINISTRIES, MINISTRY_CODES, OFFICES } from "./mock-data";

/* ------------------------------------------------------------------
   Choosing the office is the most expensive decision on the portal.
   Pick the wrong one and the request comes back "RETURNED TO APPLICANT"
   — and, for a state-government office, without a refund of the ₹10.

   So the picker is search-first, matches on what people actually type
   ("train late", "pension delay") rather than on ministry names, and
   confirms the choice in plain words before any money moves.
------------------------------------------------------------------- */

export interface Authority {
  id: string;
  ministry: string;
  office: string;
  /** What the citizen would call this office. */
  short: string;
  /** Plain-language list, shown as "They handle: …". Authored, never generated. */
  handles: string;
  /** Words a citizen might type. Never shown; only searched. */
  topics: string[];
  /** State offices cannot be filed here, and the fee is not refunded. */
  level: "central" | "state";
}

/**
 * The offices most RTIs are filed against, each with a real "they handle"
 * line. These are authored, not generated: telling a citizen an office
 * handles something it does not is how a request gets returned.
 */
export const AUTHORITIES: Authority[] = [
  {
    id: "doppw",
    ministry: "Ministry of Personnel, Public Grievances & Pensions",
    office: "Department of Pension & Pensioners' Welfare",
    short: "Pension department",
    handles:
      "pension sanction and arrears, PPO files, family pension, delays in disbursal",
    topics: ["pension", "ppo", "retirement", "arrears", "family pension", "pensioner"],
    level: "central",
  },
  {
    id: "dopt",
    ministry: "Ministry of Personnel, Public Grievances & Pensions",
    office: "Department of Personnel & Training",
    short: "Personnel & Training",
    handles:
      "central government recruitment, transfers and postings, service rules, RTI policy itself",
    topics: ["recruitment", "transfer", "posting", "promotion", "service rules", "vacancy"],
    level: "central",
  },
  {
    id: "nhai",
    ministry: "Ministry of Road Transport & Highways",
    office: "National Highways Authority of India",
    short: "Highways (NHAI)",
    handles:
      "national highway construction and repair, toll plazas, land acquisition for highways, contractor payments",
    topics: ["highway", "road", "toll", "nhai", "flyover", "bypass", "contractor", "repair"],
    level: "central",
  },
  {
    id: "railways",
    ministry: "Ministry of Railways",
    office: "Zonal Railway Office",
    short: "Indian Railways",
    handles:
      "train services and timings, fares and refunds, station work, freight, railway land",
    topics: ["train", "railway", "station", "ticket", "refund", "irctc", "platform", "late"],
    level: "central",
  },
  {
    id: "rrb",
    ministry: "Ministry of Railways",
    office: "Railway Recruitment Board",
    short: "Railway Recruitment Board",
    handles: "railway exams, answer keys, cut-offs, result and appointment status",
    topics: ["rrb", "exam", "result", "answer key", "cut off", "recruitment", "ntpc"],
    level: "central",
  },
  {
    id: "cghs",
    ministry: "Ministry of Health & Family Welfare",
    office: "Central Government Health Scheme",
    short: "CGHS",
    handles:
      "CGHS cards, empanelled hospitals, reimbursement claims and their status",
    topics: ["cghs", "hospital", "reimbursement", "medical", "health card", "claim"],
    level: "central",
  },
  {
    id: "nhm",
    ministry: "Ministry of Health & Family Welfare",
    office: "National Health Mission",
    short: "National Health Mission",
    handles:
      "public health programmes, primary health centres, vaccine and medicine supply, health scheme funds",
    topics: ["phc", "vaccine", "medicine", "asha", "health scheme", "ayushman"],
    level: "central",
  },
  {
    id: "ugc",
    ministry: "Ministry of Education",
    office: "University Grants Commission",
    short: "UGC",
    handles: "university recognition, college approvals, NET, grants to institutions",
    topics: ["ugc", "university", "college", "net", "degree", "recognition", "scholarship"],
    level: "central",
  },
  {
    id: "school",
    ministry: "Ministry of Education",
    office: "Department of School Education & Literacy",
    short: "School education",
    handles:
      "central school schemes, mid-day meal funds, Kendriya and Navodaya Vidyalayas",
    topics: ["school", "mid day meal", "kendriya", "navodaya", "teacher", "student"],
    level: "central",
  },
  {
    id: "posts",
    ministry: "Department of Posts",
    office: "Head Post Office",
    short: "Post office",
    handles:
      "speed post and parcel tracking, savings accounts, money orders, postal recruitment",
    topics: ["post", "speed post", "parcel", "money order", "postal", "courier", "letter"],
    level: "central",
  },
  {
    id: "mgnrega",
    ministry: "Ministry of Rural Development",
    office: "MGNREGA Cell",
    short: "MGNREGA",
    handles:
      "job cards, muster rolls, days of work provided, wage payments and delays",
    topics: ["mgnrega", "nrega", "job card", "wages", "muster", "rural employment", "labour"],
    level: "central",
  },
  {
    id: "land",
    ministry: "Ministry of Rural Development",
    office: "Department of Land Resources",
    short: "Land records",
    handles:
      "land record digitisation, survey and settlement programmes, watershed projects",
    topics: ["land", "survey", "record", "patta", "watershed", "digitisation"],
    level: "central",
  },
  // State-level bodies are listed deliberately rather than hidden. They
  // are the most common misfiling, and the citizen has to be warned
  // *before* paying — the portal returns these without refunding the fee.
  {
    id: "municipal",
    ministry: "Ministry of Housing & Urban Affairs",
    office: "Municipal Corporation",
    short: "Municipal corporation",
    handles:
      "water supply, drainage, garbage collection, property tax, building permissions",
    topics: [
      "water",
      "drainage",
      "garbage",
      "property tax",
      "municipal",
      "corporation",
      "sewage",
      "street light",
    ],
    level: "state",
  },
  {
    id: "rto",
    ministry: "Ministry of Road Transport & Highways",
    office: "Regional Transport Office",
    short: "RTO",
    handles: "driving licences, vehicle registration, permits, fitness certificates",
    topics: ["rto", "licence", "license", "driving", "vehicle", "registration", "permit"],
    level: "state",
  },
  {
    id: "pwd",
    ministry: "Ministry of Road Transport & Highways",
    office: "Public Works Division",
    short: "Public Works Division",
    handles: "state roads, government buildings, local construction tenders",
    topics: ["pwd", "state road", "building", "tender", "construction"],
    level: "state",
  },
];

/** The six offices most RTIs go to. Shown as chips before any typing. */
export const COMMON_IDS = ["railways", "posts", "doppw", "nhai", "cghs", "mgnrega"];

export function getAuthority(id: string): Authority | undefined {
  return AUTHORITIES.find((a) => a.id === id);
}

/**
 * Ranked search over office name, ministry and plain-language topics.
 * Runs on the device against a list that ships with the page, so step 1
 * works with no signal at all.
 */
export function searchAuthorities(query: string): Authority[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return AUTHORITIES.map((a) => {
    let score = 0;
    const short = a.short.toLowerCase();
    const office = a.office.toLowerCase();

    if (short.startsWith(q)) score += 100;
    else if (short.includes(q)) score += 60;
    if (office.includes(q)) score += 40;
    if (a.ministry.toLowerCase().includes(q)) score += 25;
    // A topic hit is worth as much as an office-name hit: "train late"
    // must find Railways even though neither word is in its name.
    for (const t of a.topics) {
      if (t === q) score += 80;
      else if (t.startsWith(q)) score += 50;
      else if (q.includes(t)) score += 35;
    }
    if (a.handles.toLowerCase().includes(q)) score += 15;
    return { a, score };
  })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((r) => r.a);
}

export { MINISTRIES, MINISTRY_CODES, OFFICES };
