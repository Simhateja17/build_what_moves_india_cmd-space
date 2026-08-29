import type { TranslationValues } from "./i18n";

export type Translate = (
  key: string,
  fallback?: string,
  values?: TranslationValues,
) => string;

/**
 * Dashboard copy is partly generated from a case: offices, subjects, dates
 * and counts are inserted after the data is loaded. Match those sentences to
 * translated templates while keeping the English fallback identical.
 */
export function translateDashboardCopy(copy: string, t: Translate): string {
  let match = copy.match(
    /^₹(\d+) was debited under reference (.+)\. Registration is still being confirmed\. Do not make another payment\.$/,
  );
  if (match) {
    return t(
      "₹{amount} was debited under reference {ref}. Registration is still being confirmed. Do not make another payment.",
      copy,
      { amount: match[1], ref: match[2] },
    );
  }

  match = copy.match(/^A reply has been received from (.+) regarding (.+)\.$/);
  if (match) {
    return t(
      "A reply has been received from {office} regarding {subject}.",
      copy,
      { office: match[1], subject: match[2] },
    );
  }

  match = copy.match(
    /^A hearing for your appeal has been fixed for (.+)\. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone\.$/,
  );
  if (match) {
    return t(
      "A hearing for your appeal has been fixed for {date}. You may attend in person, send a representative, or ask that the appeal be decided on your written submission alone.",
      copy,
      { date: match[1] },
    );
  }

  match = copy.match(
    /^(.+) replied, but withheld what you asked for\. A refusal is a decision you are entitled to challenge, and filing an appeal is free of cost\. ?(.*)$/,
  );
  if (match) {
    const deadline = match[2].trim();
    return t(
      "{office} replied, but withheld what you asked for. A refusal is a decision you are entitled to challenge, and filing an appeal is free of cost. {deadline}",
      copy,
      {
        office: match[1],
        deadline: deadline ? translateDashboardCopy(deadline, t) : "",
      },
    );
  }

  match = copy.match(
    /^The Public Authority is (\d+) days past the legal deadline\. Under the Act, this silence is deemed a refusal, and filing an appeal is free of cost\. ?(.*)$/,
  );
  if (match) {
    const deadline = match[2].trim();
    return t(
      "The Public Authority is {days} days past the legal deadline. Under the Act, this silence is deemed a refusal, and filing an appeal is free of cost. {deadline}",
      copy,
      {
        days: match[1],
        deadline: deadline ? translateDashboardCopy(deadline, t) : "",
      },
    );
  }

  match = copy.match(
    /^Your appeal against (.+) has been registered\. The Appellate Authority is required to decide within 30 days, and within 45 at the outside where it records its reasons for taking longer\.$/,
  );
  if (match) {
    return t(
      "Your appeal against {office} has been registered. The Appellate Authority is required to decide within 30 days, and within 45 at the outside where it records its reasons for taking longer.",
      copy,
      { office: match[1] },
    );
  }

  match = copy.match(
    /^The Appellate Authority's 45 days lapsed with no decision on your appeal regarding (.+)\. The Central Information Commission can now be approached, free of cost\.$/,
  );
  if (match) {
    return t(
      "The Appellate Authority's 45 days lapsed with no decision on your appeal regarding {subject}. The Central Information Commission can now be approached, free of cost.",
      copy,
      { subject: match[1] },
    );
  }

  match = copy.match(
    /^Your appeal against (.+) is now before the Central Information Commission, which sits outside the department\.$/,
  );
  if (match) {
    return t(
      "Your appeal against {office} is now before the Central Information Commission, which sits outside the department.",
      copy,
      { office: match[1] },
    );
  }

  match = copy.match(
    /^(.+) claimed an exemption over your request regarding (.+) instead of answering it\. An appeal may be filed free of cost\.$/,
  );
  if (match) {
    return t(
      "{office} claimed an exemption over your request regarding {subject} instead of answering it. An appeal may be filed free of cost.",
      copy,
      { office: match[1], subject: match[2] },
    );
  }

  match = copy.match(
    /^The (.+) the law allows has passed with no reply regarding (.+)\. An appeal may be filed free of cost\.$/,
  );
  if (match) {
    return t(
      "The {limit} the law allows has passed with no reply regarding {subject}. An appeal may be filed free of cost.",
      copy,
      { limit: match[1], subject: match[2] },
    );
  }

  match = copy.match(/^File a First Appeal by (.+)\. (\d+) day(s)? remaining\.$/);
  if (match) {
    return t(
      "File a First Appeal by {date}. {days} day{plural} remaining.",
      copy,
      { date: match[1], days: match[2], plural: match[3] ? "s" : "" },
    );
  }

  match = copy.match(/^File by (.+)\. (\d+) day(s)? remaining\.$/);
  if (match) {
    return t(
      "File by {date}. {days} day{plural} remaining.",
      copy,
      { date: match[1], days: match[2], plural: match[3] ? "s" : "" },
    );
  }

  match = copy.match(/^(.+) has (\d+) day(s)? remaining to respond\.$/);
  if (match) {
    return t(
      "{office} has {days} day{plural} remaining to respond.",
      copy,
      { office: match[1], days: match[2], plural: match[3] ? "s" : "" },
    );
  }

  return t(copy, copy);
}

export function translateRelativeAge(age: number, t: Translate): string {
  if (age <= 0) return t("today", "Today");
  if (age === 1) return t("yesterday", "Yesterday");
  return t("{count} days ago", "{count} days ago", { count: age });
}
