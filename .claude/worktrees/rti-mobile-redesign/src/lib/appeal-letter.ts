import { DerivedCase } from "./derive";
import { RtiCase, REPLY_DEADLINE_DAYS } from "./types";

/* ------------------------------------------------------------------
   The appeal, written for the citizen.

   A blank 3000-character box is where appeals die. Everything needed to
   write a competent first appeal is already known — the registration
   number, the office, the ground, and how many days have passed — so
   the app writes the letter and the citizen edits it.

   One template per ground, in the register an Appellate Authority
   expects, but with no jargon the citizen cannot follow if they read it.
------------------------------------------------------------------- */

export function draftAppealLetter(
  c: RtiCase,
  d: DerivedCase,
  ground: string,
): string {
  const head = `I filed RTI application ${c.registrationNumber} with ${c.authority.office}.`;

  switch (ground) {
    case "No Response Within the Time Limit":
      return [
        head,
        `${REPLY_DEADLINE_DAYS + d.daysLate} days have now passed and I have received no reply. Under section 7(2) of the Right to Information Act, 2005 this is a deemed refusal.`,
        `I request the First Appellate Authority to direct the CPIO to provide the information sought, and to take note of the delay under section 20 of the Act.`,
      ].join("\n\n");

    case "Refused access to Information Requested":
      return [
        head,
        `The CPIO has refused to provide the information I asked for. The refusal does not identify which exemption under section 8 of the Right to Information Act, 2005 is being relied on, or why it applies to my request.`,
        `I request the First Appellate Authority to set aside the refusal and direct that the information be provided.`,
      ].join("\n\n");

    case "Provided Incomplete,Misleading or False Information":
      return [
        head,
        `A reply was received, but it does not answer what I asked. The information provided is incomplete and does not cover the records named in my original request.`,
        `I request the First Appellate Authority to direct the CPIO to provide the complete information sought in my application.`,
      ].join("\n\n");

    case "Unreasonable amount of Fee required to Pay":
      return [
        head,
        `The CPIO has demanded an additional fee which I believe is excessive and is not calculated in accordance with the RTI Rules, 2012.`,
        `I request the First Appellate Authority to examine the fee demanded, and to direct that the information be provided on payment of the correct amount.`,
      ].join("\n\n");

    default:
      return [
        head,
        `I am dissatisfied with how this request has been dealt with, for the following reason:`,
        `[Write what happened here.]`,
        `I request the First Appellate Authority to examine the matter and direct that the information be provided.`,
      ].join("\n\n");
  }
}
