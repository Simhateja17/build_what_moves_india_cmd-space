import { Clarifier, ProblemTopic, RouteRule } from "./types";

/* ------------------------------------------------------------------
   The fourteen problems, and what a citizen can actually ask about
   each one.

   Every ask is phrased as a record the office already holds — a copy,
   a figure, a name, a date. Nothing here asks an officer to explain
   themselves, because an explanation is not a record and can be
   honestly refused.
------------------------------------------------------------------- */

/** Asked on every topic: what window should the office cover. */
const PERIOD: Clarifier = {
  id: "period",
  question: "Which period should they cover?",
  help: "A period stops them answering about one convenient month.",
  kind: "period",
  options: [
    { value: "6m", label: "The last 6 months" },
    { value: "1y", label: "The last year" },
    { value: "3y", label: "The last 3 years" },
  ],
  skipLabel: "I don't know",
  blankLabel: "period",
};

const REFERENCE: Clarifier = {
  id: "ref",
  question: "Do you have a complaint number or file number?",
  help: "If you have one, they cannot say they could not trace the matter.",
  kind: "text",
  placeholder: "e.g. GHMC/2026/14827",
  skipLabel: "I don't have one",
  blankLabel: "reference number",
};

function placeClarifier(question: string, placeholder: string): Clarifier {
  return {
    id: "place",
    question,
    help: "Any name a local would recognise is fine.",
    kind: "text",
    placeholder,
    skipLabel: "I don't know",
    blankLabel: "name of the place",
  };
}

export const TOPICS: ProblemTopic[] = [
  {
    id: "road-damage",
    label: "Damaged road or pothole",
    icon: "🛣",
    subject: "repair of {place}",
    aliases: [
      "road", "roads", "lane", "pothole", "potholes", "tar", "asphalt",
      "damaged", "broken", "repair", "highway", "footpath", "gaddha",
      "sadak",
    ],
    authorityClarifier: {
      id: "road-kind",
      question: "What kind of road is it?",
      help: "This decides which office holds the papers.",
      kind: "choice",
      options: [
        { value: "colony", label: "A lane or street inside a colony" },
        { value: "city", label: "A main road inside the city" },
        { value: "state", label: "A highway between towns" },
        { value: "nh", label: "A National Highway (has an NH number)" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "kind of road",
    },
    draftClarifiers: [
      placeClarifier("What is the road called?", "e.g. Ganesh Nagar 3rd Cross Road"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "road-damage",
    asks: [
      {
        id: "sanction",
        text: "A copy of the sanction order for repair of {place}, showing the sanctioned amount and the date of sanction, for the period {period}.",
        why: "Tells you how much money was set aside, and when.",
        defaultOn: true,
      },
      {
        id: "contractor",
        text: "The name of the contractor awarded this work and a copy of the work order issued to them.",
        why: "Names who was paid to do it.",
        defaultOn: true,
      },
      {
        id: "paid",
        text: "The total amount actually released and paid against this work till date, with the date and amount of each payment.",
        why: "Money sanctioned and money paid are often different.",
        defaultOn: true,
      },
      {
        id: "completion",
        text: "A copy of the completion certificate and the relevant measurement book entries for this work.",
        why: "This is the proof that the work was recorded as finished.",
        defaultOn: true,
      },
      {
        id: "inspection",
        text: "A copy of every inspection report and quality test report for this work.",
        why: "Shows whether anyone checked the quality.",
        defaultOn: false,
      },
      {
        id: "officer",
        text: "The name and designation of the officer responsible for maintaining {place}.",
        why: "Gives you a person to follow up with.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no repair work was sanctioned for {place} during {period}, the reasons recorded on file, and the action taken on every complaint received about this road during the same period.",
        why: "Covers the case where the answer is \"nothing was sanctioned\".",
        defaultOn: true,
      },
    ],
  },

  {
    id: "sewage",
    label: "Sewage or blocked drain",
    icon: "🚱",
    subject: "the sewage and drainage problem at {place}",
    aliases: [
      "sewage", "sewer", "drain", "drainage", "manhole", "overflow",
      "overflowing", "gutter", "stink", "smell", "dirty water", "nala",
      "blocked", "flooding",
    ],
    authorityClarifier: {
      id: "sewage-where",
      question: "Is this inside a city or town, or in a village?",
      help: "Cities have a board or a corporation wing; villages go through the panchayat.",
      kind: "choice",
      options: [
        { value: "board", label: "In a city with a water and sewerage board" },
        { value: "corp", label: "In a city or town, handled by the corporation" },
        { value: "village", label: "In a village or panchayat area" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "kind of area",
    },
    draftClarifiers: [
      placeClarifier("Which street or area is affected?", "e.g. Ganesh Nagar, 3rd Cross"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "sewage",
    asks: [
      {
        id: "complaints",
        text: "Copies of all complaints received about sewage or drainage at {place} during {period}, with the date of each and the action taken on it.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "schedule",
        text: "The sanctioned schedule for cleaning and desilting the drains and sewer lines covering {place}, and the dates on which this was actually carried out during {period}.",
        why: "Compares the promised schedule against the work recorded.",
        defaultOn: true,
      },
      {
        id: "contract",
        text: "The name of the contractor or agency responsible for this cleaning work, a copy of the contract, and the amounts paid to them during {period}.",
        why: "Shows who is being paid for work you say is not happening.",
        defaultOn: true,
      },
      {
        id: "works",
        text: "Details of any sewer or drainage works sanctioned for {place} during {period}, with the sanctioned amount, the work order and the present status.",
        why: "Catches a sanctioned repair that was never carried out.",
        defaultOn: true,
      },
      {
        id: "staff",
        text: "The number of sanitation staff sanctioned and actually posted for this area, and the name and designation of the officer in charge.",
        why: "A shortage of staff is often the whole answer.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no cleaning or repair work was carried out at {place} during {period}, the reasons recorded on file.",
        why: "Makes a nil reply useful instead of a dead end.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "water-supply",
    label: "Water supply problem",
    icon: "💧",
    subject: "the drinking water supply at {place}",
    aliases: [
      "water", "water supply", "tap", "pipeline", "borewell", "tanker",
      "pani", "no water", "drinking", "handpump", "bore",
    ],
    authorityClarifier: {
      id: "water-where",
      question: "Is this inside a city or town, or in a village?",
      kind: "choice",
      options: [
        { value: "city", label: "In a city or town with piped supply" },
        { value: "village", label: "In a village or panchayat area" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "kind of area",
    },
    draftClarifiers: [
      placeClarifier("Which street or area is affected?", "e.g. Ganesh Nagar, 3rd Cross"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "water-supply",
    asks: [
      {
        id: "sanctioned-hours",
        text: "The sanctioned frequency and duration of water supply for {place}, and the day-wise record of supply actually made during {period}.",
        why: "Puts what you are owed next to what you received.",
        defaultOn: true,
      },
      {
        id: "complaints",
        text: "Copies of all complaints received about water supply at {place} during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "tankers",
        text: "The number of water tanker trips supplied to {place} during {period}, and the total amount paid for them, with the name of the agency.",
        why: "Tanker bills are a common place for money to disappear.",
        defaultOn: true,
      },
      {
        id: "works",
        text: "Details of any pipeline, borewell or pumping works sanctioned for {place} during {period}, with the sanctioned amount, the contractor and the present status.",
        why: "Finds the sanctioned scheme nobody built.",
        defaultOn: true,
      },
      {
        id: "quality",
        text: "Copies of the water quality test reports for the supply to {place} during {period}.",
        why: "Shows whether the water was ever tested, and what it showed.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no work was sanctioned and no tanker supply was made for {place} during {period}, the reasons recorded on file.",
        why: "Makes a nil reply useful instead of a dead end.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "govt-school",
    label: "Government school",
    icon: "🏫",
    subject: "the functioning of {place}",
    aliases: [
      "school", "teacher", "teachers", "student", "class", "midday", "mid-day",
      "meal", "uniform", "textbook", "books", "scholarship", "admission",
      "vidyalaya", "principal", "toilet",
    ],
    authorityClarifier: {
      id: "school-kind",
      question: "Which kind of school is it?",
      help: "Central schools and state schools are answered by completely different offices.",
      kind: "choice",
      options: [
        { value: "state", label: "A state, zilla parishad or municipal school" },
        { value: "kv", label: "A Kendriya Vidyalaya" },
        { value: "jnv", label: "A Jawahar Navodaya Vidyalaya" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "kind of school",
    },
    draftClarifiers: [
      placeClarifier("What is the school called?", "e.g. ZPHS Ganesh Nagar"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "govt-school",
    asks: [
      {
        id: "posts",
        text: "The number of teaching posts sanctioned for {place}, the number actually filled, and the number vacant as on date, subject by subject.",
        why: "The gap between sanctioned and filled is usually the real story.",
        defaultOn: true,
      },
      {
        id: "meal",
        text: "The amount released and spent on the mid-day meal at {place} during {period}, with the number of children served each month.",
        why: "Money per child is easy to check against the days served.",
        defaultOn: true,
      },
      {
        id: "grants",
        text: "Details of every grant released to {place} during {period} — school development, maintenance, building or equipment — with the amount, the date and the purpose.",
        why: "Shows what the school was given and for what.",
        defaultOn: true,
      },
      {
        id: "spend",
        text: "Copies of the utilisation certificates and vouchers showing how those grants were spent.",
        why: "Where a grant actually went, in the school's own papers.",
        defaultOn: true,
      },
      {
        id: "inspection",
        text: "Copies of every inspection report on {place} during {period}, and the action taken on each.",
        why: "Inspections record the problems the office already knows about.",
        defaultOn: false,
      },
      {
        id: "infra",
        text: "The number of classrooms, functional toilets and drinking water facilities recorded for {place}, with the date of the last inspection.",
        why: "The recorded facilities and the real ones often differ.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no grant was released and no inspection was carried out for {place} during {period}, the reasons recorded on file.",
        why: "Makes a nil reply useful instead of a dead end.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "govt-hospital",
    label: "Government hospital",
    icon: "🏥",
    subject: "the functioning of {place}",
    aliases: [
      "hospital", "doctor", "doctors", "nurse", "medicine", "medicines",
      "clinic", "phc", "chc", "dispensary", "ward", "patient", "ambulance",
      "treatment", "aspatri", "scan", "operation",
    ],
    authorityClarifier: {
      id: "hospital-kind",
      question: "Which hospital is it?",
      help: "State hospitals and central institutes are answered by different offices.",
      kind: "choice",
      options: [
        { value: "state", label: "A district hospital, area hospital, CHC or PHC" },
        { value: "aiims", label: "AIIMS or another central institute" },
        { value: "cghs", label: "A CGHS wellness centre" },
        { value: "esic", label: "An ESIC hospital or dispensary" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "kind of hospital",
    },
    draftClarifiers: [
      placeClarifier("What is the hospital called?", "e.g. Area Hospital, Ganesh Nagar"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "govt-hospital",
    asks: [
      {
        id: "posts",
        text: "The number of doctor, nurse and technician posts sanctioned for {place}, the number filled, and the number vacant as on date, department by department.",
        why: "A vacant post is the recorded reason behind most of what goes wrong.",
        defaultOn: true,
      },
      {
        id: "medicines",
        text: "The list of medicines sanctioned for supply at {place}, and the stock register entries showing what was actually received and issued during {period}.",
        why: "Shows whether the medicine you were told to buy outside was in stock.",
        defaultOn: true,
      },
      {
        id: "equipment",
        text: "The list of equipment purchased for {place} during {period}, with the cost of each, and the present working condition of each item.",
        why: "Machines bought and never installed are a common finding.",
        defaultOn: true,
      },
      {
        id: "referrals",
        text: "The number of patients referred out of {place} to other hospitals during {period}, with the recorded reason for referral.",
        why: "Heavy referrals record a facility that cannot treat people.",
        defaultOn: false,
      },
      {
        id: "free",
        text: "A copy of the list of services and tests that are free of charge at {place}, and the amount collected from patients for any of them during {period}.",
        why: "Puts the official free list next to what people were charged.",
        defaultOn: true,
      },
      {
        id: "inspection",
        text: "Copies of every inspection report on {place} during {period}, and the action taken on each.",
        why: "Inspections record the problems the office already knows about.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no equipment was purchased and no inspection was carried out at {place} during {period}, the reasons recorded on file.",
        why: "Makes a nil reply useful instead of a dead end.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "street-light",
    label: "Street light not working",
    icon: "💡",
    subject: "street lighting at {place}",
    aliases: [
      "street light", "streetlight", "lamp", "light", "lights", "dark",
      "pole", "bulb", "lighting",
    ],
    draftClarifiers: [
      placeClarifier("Which street or area is affected?", "e.g. Ganesh Nagar, 3rd Cross"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "count",
        text: "The number of street lights sanctioned and installed at {place}, with the pole numbers, and the number recorded as working as on date.",
        why: "Gives you the official count to compare with what you can see.",
        defaultOn: true,
      },
      {
        id: "complaints",
        text: "Copies of all complaints received about street lighting at {place} during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "contract",
        text: "The name of the agency responsible for street light maintenance in this area, a copy of the contract, and the amounts paid to them during {period}.",
        why: "Shows who is being paid to keep them lit.",
        defaultOn: true,
      },
      {
        id: "bills",
        text: "The electricity bills paid for street lighting in this area during {period}.",
        why: "Bills paid for lamps that are not lit is a question worth asking.",
        defaultOn: false,
      },
      {
        id: "nil",
        text: "If no repair was carried out at {place} during {period}, the reasons recorded on file.",
        why: "Makes a nil reply useful instead of a dead end.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "garbage",
    label: "Garbage not collected",
    icon: "🗑",
    subject: "garbage collection at {place}",
    aliases: [
      "garbage", "waste", "trash", "rubbish", "bin", "dustbin", "sweeping",
      "sweeper", "collection", "kachra", "dump", "sanitation",
    ],
    draftClarifiers: [
      placeClarifier("Which street or area is affected?", "e.g. Ganesh Nagar, 3rd Cross"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "schedule",
        text: "The sanctioned schedule for door-to-door garbage collection and street sweeping at {place}, and the record of collection actually carried out during {period}.",
        why: "Compares the promised schedule against the work recorded.",
        defaultOn: true,
      },
      {
        id: "staff",
        text: "The number of sanitation workers sanctioned and actually deployed for this area, and the name and designation of the officer in charge.",
        why: "A shortage of staff is often the whole answer.",
        defaultOn: true,
      },
      {
        id: "contract",
        text: "The name of the agency contracted for waste collection in this area, a copy of the contract, and the amounts paid to them during {period}.",
        why: "Shows who is being paid for work you say is not happening.",
        defaultOn: true,
      },
      {
        id: "trips",
        text: "The vehicle trip sheets for garbage collection from {place} during {period}.",
        why: "Trip sheets record every collection the office claims to have made.",
        defaultOn: false,
      },
      {
        id: "complaints",
        text: "Copies of all complaints received about garbage at {place} during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
    ],
  },

  {
    id: "ration-pds",
    label: "Ration shop or PDS",
    icon: "🌾",
    subject: "the fair price shop serving {place}",
    aliases: [
      "ration", "pds", "fair price", "shop", "rice", "wheat", "grain",
      "card", "dealer", "kirana", "quota", "foodgrain", "kerosene",
    ],
    authorityClarifier: {
      id: "pds-what",
      question: "Is this about your card and shop, or about the grain allotment?",
      kind: "choice",
      options: [
        { value: "shop", label: "My card, my shop, or what it gave me" },
        { value: "allot", label: "The grain sent to the state or the godown stock" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "what this is about",
    },
    draftClarifiers: [
      placeClarifier("Which shop or village?", "e.g. FPS no. 214, Ganesh Nagar"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "allotment",
        text: "The month-wise quantity of foodgrain and other commodities allotted to {place} during {period}, and the quantity actually lifted by the shop.",
        why: "Allotted and lifted are two different numbers, and the gap is the story.",
        defaultOn: true,
      },
      {
        id: "distribution",
        text: "The month-wise record of distribution by this shop during {period}, showing the number of cardholders served and the quantity issued.",
        why: "Lets you check whether grain issued on paper reached people.",
        defaultOn: true,
      },
      {
        id: "cards",
        text: "The list of ration cards attached to this shop as on date, and the number of cards added or cancelled during {period}.",
        why: "Cancelled and ghost cards both show up here.",
        defaultOn: true,
      },
      {
        id: "complaints",
        text: "Copies of all complaints received against this shop during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "inspection",
        text: "Copies of every inspection report on this shop during {period}.",
        why: "Inspections record the problems the office already knows about.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "social-pension",
    label: "Old-age or widow pension",
    icon: "🧓",
    subject: "the social security pension application of {place}",
    aliases: [
      "old age", "oldage", "widow", "disability", "divyang", "social",
      "pension", "asara", "vridha", "welfare",
    ],
    draftClarifiers: [
      placeClarifier("Whose application is it, and in which village or ward?", "e.g. Smt. Lakshmi, Ganesh Nagar ward 14"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "status",
        text: "The present status of this pension application, the date it was received, and every step recorded on it since then.",
        why: "Puts a date against each step, which is where the delay becomes visible.",
        defaultOn: true,
      },
      {
        id: "order",
        text: "A copy of the sanction order, or of the rejection order with the reasons recorded, whichever was passed.",
        why: "A rejection you were never told about is a common finding.",
        defaultOn: true,
      },
      {
        id: "officer",
        text: "The name and designation of every officer with whom this file has been pending, and the period it stayed with each.",
        why: "Names where the file actually stopped.",
        defaultOn: true,
      },
      {
        id: "payments",
        text: "The month-wise record of pension paid against this application during {period}.",
        why: "Shows months that were sanctioned but never paid.",
        defaultOn: true,
      },
      {
        id: "norms",
        text: "A copy of the rules and time limit prescribed for deciding such applications.",
        why: "Their own time limit is the measure you can hold them to.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "govt-pension",
    label: "Central government pension",
    icon: "📁",
    subject: "the pension case of {place}",
    aliases: [
      "ppo", "retired", "retirement", "gratuity", "commutation", "arrears",
      "central government pension", "government pension", "pensioner",
    ],
    draftClarifiers: [
      placeClarifier("Whose pension is it, and what is the PPO or file number?", "e.g. PPO-2019/44871"),
      PERIOD,
      REFERENCE,
    ],
    exampleId: "govt-pension",
    asks: [
      {
        id: "status",
        text: "The present status of pension case {place}, and every step recorded on it, with the date of each.",
        why: "Puts a date against each step, which is where the delay becomes visible.",
        defaultOn: true,
      },
      {
        id: "reason",
        text: "The reasons recorded on file for the delay in settling this case, and copies of the relevant file notings.",
        why: "File notings are records, so they must be given — unlike an explanation.",
        defaultOn: true,
      },
      {
        id: "officer",
        text: "The name and designation of the officer currently holding this file, and of every officer it has been with since it was opened.",
        why: "Names where the file actually stopped.",
        defaultOn: true,
      },
      {
        id: "objections",
        text: "Copies of every objection raised on this case and of the reply sent by the office to each.",
        why: "Shows whether the case was really returned, and why.",
        defaultOn: true,
      },
      {
        id: "timeline",
        text: "The prescribed time limit for settling such a case, and the number of similar cases pending beyond that limit in this office.",
        why: "Puts your case next to everyone else's.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "electricity",
    label: "Electricity supply or bill",
    icon: "⚡",
    subject: "the electricity supply at {place}",
    aliases: [
      "electricity", "power", "current", "bill", "meter", "transformer",
      "outage", "cut", "voltage", "connection", "discom", "line", "shock",
    ],
    draftClarifiers: [
      placeClarifier("Which area or service connection?", "e.g. service no. 4412, Ganesh Nagar"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "outages",
        text: "The recorded log of power interruptions on the feeder serving {place} during {period}, with the duration and cause of each.",
        why: "The official outage log is usually far shorter than what you lived through.",
        defaultOn: true,
      },
      {
        id: "readings",
        text: "The meter readings recorded for this connection during {period}, with the date of each reading and the name of the person who took it.",
        why: "Catches bills raised on readings nobody took.",
        defaultOn: true,
      },
      {
        id: "maintenance",
        text: "The maintenance record of the transformer serving {place} during {period}, and the date of the last inspection.",
        why: "Shows whether the equipment was ever looked at.",
        defaultOn: true,
      },
      {
        id: "complaints",
        text: "Copies of all complaints received about supply at {place} during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "norms",
        text: "A copy of the standards of performance prescribed for restoring supply and for correcting a wrong bill.",
        why: "Their own standard is the measure you can hold them to.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "mgnrega",
    label: "MGNREGA work or job card",
    icon: "⛏",
    subject: "MGNREGA works at {place}",
    aliases: [
      "mgnrega", "nrega", "job card", "jobcard", "muster", "wage", "wages",
      "100 days", "employment guarantee", "rozgar", "labour", "coolie",
    ],
    draftClarifiers: [
      placeClarifier("Which village or panchayat?", "e.g. Ganesh Nagar Gram Panchayat"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "works",
        text: "The list of works sanctioned and executed at {place} under MGNREGA during {period}, with the estimate, the sanctioned amount and the present status of each.",
        why: "The sanctioned list is the baseline for everything else.",
        defaultOn: true,
      },
      {
        id: "muster",
        text: "Copies of the muster rolls for these works, showing the names of workers and the days recorded against each.",
        why: "Muster rolls are where names of people who never worked appear.",
        defaultOn: true,
      },
      {
        id: "wages",
        text: "The wage payment record for these works during {period}, with the amount paid to each worker and the date of payment.",
        why: "Shows delayed wages, and wages recorded but never received.",
        defaultOn: true,
      },
      {
        id: "measurement",
        text: "Copies of the measurement book entries and the completion certificates for these works.",
        why: "This is the proof that the work was recorded as finished.",
        defaultOn: true,
      },
      {
        id: "demand",
        text: "The number of applications for work received at {place} during {period}, the number to whom work was given within fifteen days, and the unemployment allowance paid.",
        why: "Work not given within fifteen days carries an allowance almost nobody claims.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "railways",
    label: "Railway station, train or recruitment",
    icon: "🚆",
    subject: "the matter concerning {place}",
    aliases: [
      "railway", "railways", "train", "station", "platform", "rrb",
      "recruitment", "ticket", "coach", "irctc", "rail", "late train",
    ],
    authorityClarifier: {
      id: "rail-what",
      question: "Is this about a station or train, or about a recruitment exam?",
      kind: "choice",
      options: [
        { value: "zone", label: "A station, a train, or railway staff" },
        { value: "rrb", label: "A railway recruitment examination" },
      ],
      skipLabel: "I'm not sure",
      blankLabel: "what this is about",
    },
    draftClarifiers: [
      placeClarifier("Which station, train or examination?", "e.g. Secunderabad station"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "complaints",
        text: "Copies of all complaints received about {place} during {period}, with the action taken on each.",
        why: "Proves the office knew, and shows what it says it did.",
        defaultOn: true,
      },
      {
        id: "contracts",
        text: "The names of the agencies contracted for cleaning, catering and maintenance at {place}, copies of the contracts, and the penalties imposed on them during {period}.",
        why: "Penalties imposed, or not imposed, tell you how the contract is being run.",
        defaultOn: true,
      },
      {
        id: "works",
        text: "Details of works sanctioned for {place} during {period}, with the sanctioned amount and the present status of each.",
        why: "Finds the sanctioned improvement nobody built.",
        defaultOn: true,
      },
      {
        id: "exam",
        text: "The number of vacancies notified, the cut-off marks applied, and a copy of the answer key and the result file for the examination concerned.",
        why: "The cut-off and the answer key are what a candidate needs to check a result.",
        defaultOn: false,
      },
      {
        id: "officer",
        text: "The name and designation of the officer responsible for this matter.",
        why: "Gives you a person to follow up with.",
        defaultOn: false,
      },
    ],
  },

  {
    id: "passport",
    label: "Passport delay",
    icon: "🛂",
    subject: "passport application {place}",
    aliases: [
      "passport", "rpo", "police verification", "psk", "seva kendra",
      "renewal", "tatkal", "visa",
    ],
    draftClarifiers: [
      placeClarifier("What is the file or application number?", "e.g. HY1234567890126"),
      PERIOD,
      REFERENCE,
    ],
    asks: [
      {
        id: "status",
        text: "The present status of passport application {place}, and every step recorded on it, with the date of each.",
        why: "Puts a date against each step, which is where the delay becomes visible.",
        defaultOn: true,
      },
      {
        id: "police",
        text: "The date on which the police verification report for this application was called for, the date it was received, and a copy of the report received.",
        why: "Most delays sit inside this gap, and the report is your own record.",
        defaultOn: true,
      },
      {
        id: "reason",
        text: "The reasons recorded on file for the delay or for keeping this application on hold, with copies of the relevant file notings.",
        why: "File notings are records, so they must be given — unlike an explanation.",
        defaultOn: true,
      },
      {
        id: "officer",
        text: "The name and designation of the officer currently dealing with this application.",
        why: "Gives you a person to follow up with.",
        defaultOn: false,
      },
      {
        id: "norms",
        text: "The prescribed time limit for issuing a passport in such cases, and the number of applications pending beyond that limit in this office.",
        why: "Puts your case next to everyone else's.",
        defaultOn: false,
      },
    ],
  },
];

export const TOPIC_BY_ID: Record<string, ProblemTopic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
);

/* ------------------------------------------------------------------
   Routing. First rule that matches wins; every other authority named
   in a topic's rules becomes an alternative the citizen can switch to.
------------------------------------------------------------------- */

export const ROUTES: Record<string, RouteRule[]> = {
  "road-damage": [
    { answer: "nh", authorityId: "nhai" },
    { answer: "state", authorityId: "state-pwd" },
    { answer: "city", authorityId: "mc-roads" },
    { answer: "colony", authorityId: "mc-roads" },
    { bodyType: "rural", authorityId: "state-pwd" },
    { authorityId: "mc-roads" },
  ],
  sewage: [
    { answer: "village", authorityId: "panchayat-rws" },
    { answer: "corp", authorityId: "mc-sewer" },
    { answer: "board", authorityId: "water-board" },
    { bodyType: "rural", authorityId: "panchayat-rws" },
    { authorityId: "water-board" },
  ],
  "water-supply": [
    { answer: "village", authorityId: "panchayat-rws" },
    { answer: "city", authorityId: "water-board" },
    { bodyType: "rural", authorityId: "panchayat-rws" },
    { authorityId: "water-board" },
  ],
  "govt-school": [
    { answer: "kv", authorityId: "kvs" },
    { answer: "jnv", authorityId: "nvs" },
    { authorityId: "deo" },
  ],
  "govt-hospital": [
    { answer: "aiims", authorityId: "aiims" },
    { answer: "cghs", authorityId: "cghs" },
    { answer: "esic", authorityId: "esic" },
    { authorityId: "dmho" },
  ],
  "street-light": [{ authorityId: "mc-electrical" }],
  garbage: [{ authorityId: "mc-sanitation" }],
  "ration-pds": [
    { answer: "allot", authorityId: "fci" },
    { authorityId: "civil-supplies" },
  ],
  "social-pension": [{ authorityId: "social-welfare" }],
  "govt-pension": [{ authorityId: "doppw" }],
  electricity: [{ authorityId: "discom" }],
  mgnrega: [{ authorityId: "drda" }],
  railways: [
    { answer: "rrb", authorityId: "rrb" },
    { authorityId: "railway" },
  ],
  passport: [{ authorityId: "rpo" }],
};
