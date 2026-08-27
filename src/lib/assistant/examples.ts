/* ------------------------------------------------------------------
   Worked examples. A first-time filer often cannot picture what a
   finished RTI looks like, and a blank box is intimidating in a way
   a filled one is not. These are complete, real-shaped requests they
   can read, or take as a starting point and edit.
------------------------------------------------------------------- */

export interface ExampleDraft {
  id: string;
  title: string;
  blurb: string;
  authority: string;
  text: string;
}

export const EXAMPLES: ExampleDraft[] = [
  {
    id: "road-damage",
    title: "Money spent on a road that was never repaired",
    blurb: "Sanction, contractor, payments and the completion certificate.",
    authority: "Municipal Corporation, Engineering (Roads) Wing",
    text: `Under the Right to Information Act, 2005, I request the following information about the repair of Ganesh Nagar 3rd Cross Road, Ward 14:

1. A copy of the sanction order for repair of the said road, showing the sanctioned amount and the date of sanction, for the period 01/03/2026 to 27/08/2026.

2. The name of the contractor awarded this work and a copy of the work order issued to them.

3. The total amount actually released and paid against this work till date, with the date and amount of each payment.

4. A copy of the completion certificate and the relevant measurement book entries for this work.

5. If no repair work was sanctioned for this road during the said period, the reasons recorded on file, and the action taken on every complaint received about this road during the same period.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
  {
    id: "sewage",
    title: "A drain that overflows every monsoon",
    blurb: "Complaints, cleaning schedule, contractor and what was paid.",
    authority: "Water Supply & Sewerage Board, division office",
    text: `Under the Right to Information Act, 2005, I request the following information about the sewage and drainage problem at Ganesh Nagar, 3rd Cross:

1. Copies of all complaints received about sewage or drainage at this location during 01/03/2026 to 27/08/2026, with the date of each and the action taken on it.

2. The sanctioned schedule for cleaning and desilting the drains and sewer lines covering this location, and the dates on which this was actually carried out during the said period.

3. The name of the contractor or agency responsible for this cleaning work, a copy of the contract, and the amounts paid to them during the said period.

4. Details of any sewer or drainage works sanctioned for this location during the said period, with the sanctioned amount, the work order and the present status.

5. If no cleaning or repair work was carried out at this location during the said period, the reasons recorded on file.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
  {
    id: "water-supply",
    title: "Water that comes once a week",
    blurb: "Sanctioned supply against actual supply, and the tanker bills.",
    authority: "Water Supply & Sewerage Board, division office",
    text: `Under the Right to Information Act, 2005, I request the following information about the drinking water supply at Ganesh Nagar, 3rd Cross:

1. The sanctioned frequency and duration of water supply for this locality, and the day-wise record of supply actually made during 01/03/2026 to 27/08/2026.

2. Copies of all complaints received about water supply at this locality during the said period, with the action taken on each.

3. The number of water tanker trips supplied to this locality during the said period, and the total amount paid for them, with the name of the agency.

4. Details of any pipeline, borewell or pumping works sanctioned for this locality during the said period, with the sanctioned amount, the contractor and the present status.

5. Copies of the water quality test reports for the supply to this locality during the said period.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
  {
    id: "govt-school",
    title: "A school with no teachers and a missing grant",
    blurb: "Posts sanctioned against posts filled, and where the grant went.",
    authority: "District Educational Officer",
    text: `Under the Right to Information Act, 2005, I request the following information about the functioning of ZPHS Ganesh Nagar:

1. The number of teaching posts sanctioned for this school, the number actually filled, and the number vacant as on date, subject by subject.

2. The amount released and spent on the mid-day meal at this school during 01/03/2026 to 27/08/2026, with the number of children served each month.

3. Details of every grant released to this school during the said period - school development, maintenance, building or equipment - with the amount, the date and the purpose.

4. Copies of the utilisation certificates and vouchers showing how those grants were spent.

5. Copies of every inspection report on this school during the said period, and the action taken on each.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
  {
    id: "govt-hospital",
    title: "A hospital that sends you outside to buy medicine",
    blurb: "Vacant posts, the stock register, and what is meant to be free.",
    authority: "District Medical & Health Officer",
    text: `Under the Right to Information Act, 2005, I request the following information about the functioning of the Area Hospital, Ganesh Nagar:

1. The number of doctor, nurse and technician posts sanctioned for this hospital, the number filled, and the number vacant as on date, department by department.

2. The list of medicines sanctioned for supply at this hospital, and the stock register entries showing what was actually received and issued during 01/03/2026 to 27/08/2026.

3. The list of equipment purchased for this hospital during the said period, with the cost of each, and the present working condition of each item.

4. A copy of the list of services and tests that are free of charge at this hospital, and the amount collected from patients for any of them during the said period.

5. If no equipment was purchased and no inspection was carried out during the said period, the reasons recorded on file.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
  {
    id: "govt-pension",
    title: "A pension file that has not moved in seven months",
    blurb: "Status, the notings recording the delay, and who is holding it.",
    authority: "Department of Pension & Pensioners' Welfare",
    text: `Under the Right to Information Act, 2005, I request the following information about pension case PPO-2019/44871:

1. The present status of this pension case, and every step recorded on it, with the date of each.

2. The reasons recorded on file for the delay in settling this case, and copies of the relevant file notings.

3. The name and designation of the officer currently holding this file, and of every officer it has been with since it was opened.

4. Copies of every objection raised on this case and of the reply sent by the office to each.

5. The prescribed time limit for settling such a case, and the number of similar cases pending beyond that limit in this office.

I am ready to pay the prescribed fee for the copies. If any part of this information is held by another public authority, kindly transfer that part under Section 6(3) of the Act within five days.`,
  },
];

export const EXAMPLE_BY_ID: Record<string, ExampleDraft> = Object.fromEntries(
  EXAMPLES.map((e) => [e.id, e]),
);
