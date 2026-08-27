import { AuthorityMatch } from "./types";

/* ------------------------------------------------------------------
   Who actually holds the record.

   The one rule that keeps this table honest: a centrally *funded*
   scheme is not a central *authority*. MGNREGA and Jal Jeevan money
   comes from Delhi, but the muster rolls and work orders sit in a
   district office under state RTI rules. `level` is therefore always
   set against the office that holds the paper, never the ministry
   that wrote the cheque — getting that backwards is the single most
   common way a citizen wastes a filing.

   `ministry` and `office` are set on central authorities only, and
   their strings must exist in MINISTRIES / OFFICES so the existing
   file-request form can pre-select them.
------------------------------------------------------------------- */

export const AUTHORITIES: Record<string, AuthorityMatch> = {
  /* ---------------- roads ---------------- */
  "mc-roads": {
    id: "mc-roads",
    shortName: "Municipal Corporation",
    name: "{city} Municipal Corporation",
    wing: "Engineering (Roads) Wing",
    pioTitle: "Public Information Officer, Engineering Wing",
    level: "local",
    why: {
      work: "Repairing and maintaining roads inside city limits is the Corporation's own work.",
      records:
        "Sanction orders, tenders and completion certificates for those repairs sit in its Engineering Wing.",
      notThem:
        "Not the Ministry of Road Transport & Highways — it only keeps records for National Highways, and a colony lane is not one.",
    },
    condition: "If it is a street or road inside the city.",
  },
  "state-pwd": {
    id: "state-pwd",
    shortName: "State Roads & Buildings Department",
    name: "Public Works Department, Government of {state}",
    wing: "Roads & Buildings Division, {city}",
    pioTitle: "Public Information Officer, Roads & Buildings Division",
    level: "state",
    why: {
      work: "State highways and major district roads are built and maintained by the state PWD, not by the city.",
      records:
        "The division office holds the estimate, tender, work order and measurement books for every stretch it maintains.",
      notThem:
        "Not the Municipal Corporation — its powers stop at roads inside the municipal boundary.",
    },
    condition: "If it is a highway between towns, or a main state road.",
  },
  nhai: {
    id: "nhai",
    shortName: "National Highways Authority of India",
    name: "National Highways Authority of India",
    wing: "Project Implementation Unit, {city}",
    pioTitle: "Central Public Information Officer, Project Implementation Unit",
    level: "central",
    ministry: "Ministry of Road Transport & Highways",
    office: "National Highways Authority of India",
    why: {
      work: "National Highways are built and maintained by NHAI through its Project Implementation Units.",
      records:
        "The PIU covering your stretch holds the concession agreement, the maintenance schedule and every payment made to the contractor.",
      notThem:
        "Not the Municipal Corporation — a National Highway passing through a city is still NHAI's road.",
    },
    condition: "Only if the road carries an NH number.",
  },

  /* ---------------- water and sewage ---------------- */
  "water-board": {
    id: "water-board",
    shortName: "Water Supply & Sewerage Board",
    name: "{city} Water Supply & Sewerage Board",
    wing: "Division office for your area",
    pioTitle: "Public Information Officer, Division Office",
    level: "local",
    why: {
      work: "Piped water and the sewer network inside the city are run by the city's water board.",
      records:
        "Complaint registers, tanker bills, pipeline work orders and supply schedules are kept at the division office covering your locality.",
      notThem:
        "Not the Ministry of Jal Shakti — it funds and monitors schemes, but holds none of the day-to-day records for your street.",
    },
    condition: "If you are in a city or town with piped supply.",
  },
  "mc-sewer": {
    id: "mc-sewer",
    shortName: "Municipal Corporation",
    name: "{city} Municipal Corporation",
    wing: "Sewerage & Drainage Wing",
    pioTitle: "Public Information Officer, Sewerage Wing",
    level: "local",
    why: {
      work: "Storm-water drains and the sewer lines along your street are cleared by the Corporation's own staff and contractors.",
      records:
        "Complaint registers, desilting contracts and the cleaning schedule for your ward are held at the ward office.",
      notThem:
        "Not the state Pollution Control Board — it acts on pollution, not on a blocked drain outside your house.",
    },
    condition: "In cities where drains are with the Corporation, not the board.",
  },
  "panchayat-rws": {
    id: "panchayat-rws",
    shortName: "Rural Water Supply Department",
    name: "Rural Water Supply & Sanitation Department, Government of {state}",
    wing: "Sub-division office, with the Gram Panchayat",
    pioTitle: "Public Information Officer, Sub-Division Office",
    level: "state",
    why: {
      work: "Village hand pumps, borewells and piped-water schemes are executed by the state's rural water supply wing along with the Gram Panchayat.",
      records:
        "Scheme sanctions, contractor bills and water-testing reports are held by the sub-division; the Panchayat holds the resolutions and complaint entries.",
      notThem:
        "Not the Jal Jeevan Mission office in Delhi — the money is central, but every record you want was written in your district.",
    },
    condition: "If the problem is in a village or panchayat area.",
  },

  /* ---------------- street services ---------------- */
  "mc-electrical": {
    id: "mc-electrical",
    shortName: "Municipal Corporation",
    name: "{city} Municipal Corporation",
    wing: "Electrical Wing",
    pioTitle: "Public Information Officer, Electrical Wing",
    level: "local",
    why: {
      work: "Street lights are installed, powered and repaired by the Corporation's electrical wing.",
      records:
        "The wing holds the maintenance contract, the pole-wise repair log and the electricity bills paid for your area.",
      notThem:
        "Not the electricity company — it sells the power, but the poles and lamps on your street belong to the Corporation.",
    },
  },
  "mc-sanitation": {
    id: "mc-sanitation",
    shortName: "Municipal Corporation",
    name: "{city} Municipal Corporation",
    wing: "Sanitation & Public Health Wing",
    pioTitle: "Public Information Officer, Sanitation Wing",
    level: "local",
    why: {
      work: "Door-to-door collection, sweeping and garbage transport are the Corporation's statutory duty.",
      records:
        "The ward office holds the sanitation worker roster, the vehicle trip sheets and the collection contract for your area.",
      notThem:
        "Not the Swachh Bharat Mission office — it runs the campaign and the rankings, not your ward's bin.",
    },
  },

  /* ---------------- schools ---------------- */
  deo: {
    id: "deo",
    shortName: "District Education Officer",
    name: "Department of School Education, Government of {state}",
    wing: "Office of the District Educational Officer, {city}",
    pioTitle: "Public Information Officer, District Educational Office",
    level: "state",
    why: {
      work: "Government and aided schools are run by the state's school education department through the district office.",
      records:
        "Teacher sanction and vacancy statements, mid-day meal accounts, building grants and inspection reports are all held at the district office.",
      notThem:
        "Not the Ministry of Education — school education is run by the states, and Delhi holds no file on your school.",
    },
    condition: "For a state, zilla parishad or municipal school.",
  },
  kvs: {
    id: "kvs",
    shortName: "Kendriya Vidyalaya Sangathan",
    name: "Kendriya Vidyalaya Sangathan",
    wing: "Regional Office covering {city}",
    pioTitle: "Central Public Information Officer, Regional Office",
    level: "central",
    ministry: "Ministry of Education",
    office: "Kendriya Vidyalaya Sangathan",
    why: {
      work: "Kendriya Vidyalayas are run directly by KVS, an autonomous body under the Ministry of Education.",
      records:
        "The regional office holds staff strength, admission records, fund releases and inspection reports for every KV in its region.",
      notThem:
        "Not the state education department — a KV sits inside your state but is not run by it.",
    },
    condition: "Only for a Kendriya Vidyalaya.",
  },
  nvs: {
    id: "nvs",
    shortName: "Navodaya Vidyalaya Samiti",
    name: "Navodaya Vidyalaya Samiti",
    wing: "Regional Office covering {city}",
    pioTitle: "Central Public Information Officer, Regional Office",
    level: "central",
    ministry: "Ministry of Education",
    office: "Navodaya Vidyalaya Samiti",
    why: {
      work: "Jawahar Navodaya Vidyalayas are run by NVS, an autonomous body under the Ministry of Education.",
      records:
        "The regional office holds selection-test records, hostel and mess accounts, staff strength and inspection reports.",
      notThem:
        "Not the District Education Officer — a JNV is in the district but not under it.",
    },
    condition: "Only for a Jawahar Navodaya Vidyalaya.",
  },

  /* ---------------- hospitals ---------------- */
  dmho: {
    id: "dmho",
    shortName: "District Medical & Health Office",
    name: "Department of Health & Family Welfare, Government of {state}",
    wing: "Office of the District Medical & Health Officer, {city}",
    pioTitle: "Public Information Officer, District Medical & Health Office",
    level: "state",
    why: {
      work: "District hospitals, area hospitals and primary health centres are run by the state health department.",
      records:
        "Sanctioned and vacant posts, medicine indents and stock registers, equipment purchases and patient statistics are held at the district office.",
      notThem:
        "Not the Ministry of Health & Family Welfare — public health is a state subject, and Delhi holds no register from your PHC.",
    },
    condition: "For a district hospital, area hospital, CHC or PHC.",
  },
  aiims: {
    id: "aiims",
    shortName: "AIIMS or central institute",
    name: "All India Institute of Medical Sciences (AIIMS)",
    wing: "Administration, the institute you visited",
    pioTitle: "Central Public Information Officer, the institute",
    level: "central",
    ministry: "Ministry of Health & Family Welfare",
    office: "All India Institute of Medical Sciences (AIIMS)",
    why: {
      work: "AIIMS and the other central institutes are autonomous bodies funded and controlled by the Union health ministry.",
      records:
        "Each institute has its own CPIO holding appointment queues, equipment purchases, faculty strength and expenditure.",
      notThem:
        "Not the state health department — an AIIMS in your state is not run by your state.",
    },
    condition: "Only for AIIMS, PGIMER, JIPMER and similar institutes.",
  },
  cghs: {
    id: "cghs",
    shortName: "CGHS",
    name: "Central Government Health Scheme",
    wing: "Office of the Additional Director, CGHS {city}",
    pioTitle: "Central Public Information Officer, CGHS",
    level: "central",
    ministry: "Ministry of Health & Family Welfare",
    office: "Central Government Health Scheme",
    why: {
      work: "CGHS wellness centres serve central government employees and pensioners and are run by the Union health ministry.",
      records:
        "The city's Additional Director holds medicine supply records, empanelled hospital rates and reimbursement claim files.",
      notThem:
        "Not the state health department — CGHS is a central scheme with its own offices.",
    },
    condition: "Only for a CGHS wellness centre or CGHS reimbursement.",
  },
  esic: {
    id: "esic",
    shortName: "ESIC",
    name: "Employees' State Insurance Corporation",
    wing: "Regional Office, {state}",
    pioTitle: "Central Public Information Officer, ESIC Regional Office",
    level: "central",
    ministry: "Ministry of Health & Family Welfare",
    office: "Employees' State Insurance Corporation (ESIC)",
    why: {
      work: "ESIC hospitals and dispensaries serve insured workers and are run by the Corporation, a central body.",
      records:
        "The regional office holds contribution records, hospital staffing and the referral and reimbursement files.",
      notThem:
        "Not the state labour department — some ESI hospitals are state-run, but the Corporation's own records are central.",
    },
    condition: "For an ESIC hospital or dispensary.",
  },

  /* ---------------- entitlements ---------------- */
  "civil-supplies": {
    id: "civil-supplies",
    shortName: "District Civil Supplies Office",
    name: "Department of Food & Civil Supplies, Government of {state}",
    wing: "Office of the District Civil Supplies Officer, {city}",
    pioTitle: "Public Information Officer, District Civil Supplies Office",
    level: "state",
    why: {
      work: "Ration cards, fair price shop licences and monthly distribution are handled by the state's civil supplies department.",
      records:
        "The district office holds shop-wise allotment and lifting registers, the stock received by your shop and every complaint against it.",
      notThem:
        "Not the Food Corporation of India — FCI moves grain up to the state godown, and what happens after that is the state's record.",
    },
    condition: "For your card, your shop, or what it did or did not give you.",
  },
  fci: {
    id: "fci",
    shortName: "Food Corporation of India",
    name: "Food Corporation of India",
    wing: "Regional Office, {state}",
    pioTitle: "Central Public Information Officer, FCI Regional Office",
    level: "central",
    ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
    office: "Food Corporation of India",
    why: {
      work: "FCI procures, stores and issues foodgrain to the states from its depots.",
      records:
        "The regional office holds depot stock, quality inspection reports and the quantity issued to your state each month.",
      notThem:
        "Not the district civil supplies office — it receives the grain, it does not decide the central allotment.",
    },
    condition: "Only for the central allotment or godown stock.",
  },
  "social-welfare": {
    id: "social-welfare",
    shortName: "District Social Welfare Office",
    name: "Department of Women, Child & Social Welfare, Government of {state}",
    wing: "District Social Welfare Office, {city}",
    pioTitle: "Public Information Officer, District Social Welfare Office",
    level: "state",
    why: {
      work: "Old-age, widow and disability pensions are sanctioned and paid by the state's welfare department.",
      records:
        "The district office holds your application, the sanction or rejection order, and the month-wise payment list for your village or ward.",
      notThem:
        "Not the Ministry of Rural Development — it contributes part of the amount, but the sanction file is in your district.",
    },
  },
  doppw: {
    id: "doppw",
    shortName: "Department of Pension & Pensioners' Welfare",
    name: "Ministry of Personnel, Public Grievances & Pensions",
    wing: "Department of Pension & Pensioners' Welfare",
    pioTitle: "Central Public Information Officer",
    level: "central",
    ministry: "Ministry of Personnel, Public Grievances & Pensions",
    office: "Department of Pension & Pensioners' Welfare",
    why: {
      work: "Pension for a retired central government employee is processed by the department the person served, under DoPPW's rules.",
      records:
        "The PPO file, the qualifying-service certificate and every note recording the delay sit with the pension-sanctioning authority.",
      notThem:
        "Not your state treasury — a central pension is not paid on state records.",
    },
  },
  discom: {
    id: "discom",
    shortName: "State electricity distribution company",
    name: "Electricity Distribution Company, {state}",
    wing: "Sub-division office for your area",
    pioTitle: "Public Information Officer, Sub-Division Office",
    level: "state",
    why: {
      work: "Supply, metering and billing in your area are handled by the state distribution company.",
      records:
        "The sub-division office holds your meter readings, the outage log for your feeder and the transformer maintenance record.",
      notThem:
        "Not the Ministry of Power — it sets national policy and holds nothing about your connection.",
    },
  },
  drda: {
    id: "drda",
    shortName: "District Programme Coordinator, MGNREGA",
    name: "Department of Rural Development, Government of {state}",
    wing: "Office of the District Programme Coordinator (DRDA), {city}",
    pioTitle: "Public Information Officer, District Programme Coordinator",
    level: "state",
    why: {
      work: "MGNREGA works are sanctioned and executed by the district administration through the Gram Panchayat.",
      records:
        "Muster rolls, job card registers, measurement books and wage payment lists are all held in the district and the block.",
      notThem:
        "Not the Ministry of Rural Development — the scheme is central, but every muster roll you want was signed in your block.",
    },
  },

  /* ---------------- central services ---------------- */
  railway: {
    id: "railway",
    shortName: "Zonal Railway",
    name: "Ministry of Railways",
    wing: "Zonal Railway office covering {city}",
    pioTitle: "Central Public Information Officer, Zonal Railway",
    level: "central",
    ministry: "Ministry of Railways",
    office: "Zonal Railway Office",
    why: {
      work: "Stations, trains and railway land are run by the zone, a unit of the Ministry of Railways.",
      records:
        "The zonal office holds punctuality records, complaint files, contract details for catering and cleaning, and station works.",
      notThem:
        "Not your state government — railways are a Union subject everywhere in India.",
    },
    condition: "For anything about a station, a train or railway staff.",
  },
  rrb: {
    id: "rrb",
    shortName: "Railway Recruitment Board",
    name: "Ministry of Railways",
    wing: "Railway Recruitment Board, {city}",
    pioTitle: "Central Public Information Officer, Railway Recruitment Board",
    level: "central",
    ministry: "Ministry of Railways",
    office: "Railway Recruitment Board",
    why: {
      work: "Recruitment to railway posts is conducted by the Railway Recruitment Boards.",
      records:
        "The board holds vacancy notifications, cut-off marks, answer keys and the result files for each examination.",
      notThem:
        "Not the zonal railway — it takes the staff, it does not run the examination.",
    },
    condition: "Only for a railway recruitment examination.",
  },
  rpo: {
    id: "rpo",
    shortName: "Regional Passport Office",
    name: "Ministry of External Affairs",
    wing: "Regional Passport Office, {city}",
    pioTitle: "Central Public Information Officer, Regional Passport Office",
    level: "central",
    ministry: "Ministry of External Affairs",
    office: "Regional Passport Office",
    why: {
      work: "Passports are issued by the Regional Passport Office under the Ministry of External Affairs.",
      records:
        "The RPO holds your file, the police verification report it received, and the reason recorded for any hold or delay.",
      notThem:
        "Not the local police station — it writes the verification report, but the decision and the file sit with the RPO.",
    },
  },
};

/** Fills {city} / {state} in an authority's display strings. */
export function fillPlaces(
  text: string,
  place: { city?: string; state?: string },
): string {
  return text
    .replace(/\{city\}/g, place.city?.trim() || "your city")
    .replace(/\{state\}/g, place.state?.trim() || "your state");
}
