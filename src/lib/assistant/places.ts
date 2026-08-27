/* ------------------------------------------------------------------
   Where the citizen is, and where a state matter actually gets filed.

   The finder is only half useful if it says "this belongs to your
   state" and stops. The whole point of naming the state is to be able
   to say what to do next in that state.
------------------------------------------------------------------- */

export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export interface StateFiling {
  /** The state's own RTI portal, where one exists. */
  portal?: string;
  /** How a citizen actually hands the application over. */
  how: string;
}

const GENERIC: StateFiling = {
  how: "Hand or post your application to the Public Information Officer of the office named above, with the fee your state prescribes. Most states accept a court-fee stamp, a postal order or cash at the counter, and every office must give you a receipt.",
};

/** A handful of states with their own online route; the rest fall back. */
const FILING: Record<string, StateFiling> = {
  Delhi: {
    portal: "rtionline.delhi.gov.in",
    how: "Delhi has its own RTI portal covering Delhi government departments and the municipal bodies. You can file online there, or hand the application to the PIO of the office named above.",
  },
  Maharashtra: {
    portal: "rtionline.maharashtra.gov.in",
    how: "Maharashtra runs its own RTI portal for state departments and local bodies. You can also hand the application to the PIO at the office named above.",
  },
  Karnataka: {
    portal: "rtionline.karnataka.gov.in",
    how: "Karnataka runs its own RTI portal for state departments. Municipal matters are often faster in person — the PIO at the ward office must accept it and give you a receipt.",
  },
  Telangana: {
    how: "Telangana does not have a single online RTI portal. Hand or post your application to the PIO of the office named above, with the prescribed fee, and insist on a dated receipt.",
  },
  "Uttar Pradesh": {
    portal: "rtionline.up.gov.in",
    how: "Uttar Pradesh runs its own RTI portal (Jan Suchna) for state departments. You can also hand the application to the PIO at the office named above.",
  },
};

export function filingFor(stateName: string): StateFiling {
  return FILING[stateName] ?? GENERIC;
}
