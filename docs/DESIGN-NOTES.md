# RTI Saral — design notes

Notes from the discussion that happened *before* any code was written. This is
the reasoning trail: why RTI Online, what is actually wrong with it, and where
every feature in the build came from.

---

## 1. Choosing the platform

Ten official platforms were on the table: IRCTC, Income Tax e-Filing, CPGRAMS,
GST, EPFO, MCA, National Cyber Crime Reporting, UMANG, Parivahan Sewa, RTI
Online.

**Ruled out early:**

- **UMANG** — an app-of-apps with no single citizen journey to redesign.
- **GST, MCA** — business/professional users, not ordinary citizens; weaker
  resonance for a "busy frustrated citizen" brief.
- **CPGRAMS, Cyber Crime** — already fairly narrow single-form flows; less
  surface area to visibly improve.

**Shortlisted:** Parivahan Sewa, IRCTC, EPFO, Income Tax — all with well-known
frustration and a clear dominant task.

**The decision was made by looking, not by reasoning.** Screenshots were pulled
of the actual portals. RTI Online was visibly the worst of the set, and it won
the pick on evidence rather than reputation.

## 2. What is actually wrong with RTI Online

From five captured pages of the live portal (`rtionline.gov.in`):

**Homepage**
- 2010s-era gradient header, `A+ / A / A-` font-resize links, a blinking "NEW"
  GIF badge.
- A red warning banner that is literally truncated mid-sentence: *"The Central
  Information Commission (CIC) h…"*
- The entire RTI and appeals process — the single most important thing a citizen
  needs to understand — is explained as a **static flowchart image** full of
  "30 Days / 45 Days / Section 18 Complaint to CIC" boxes. Not interactive. Not
  personalised. Just a picture.

**Submit Request form**
- One giant unguided page: authority selection → personal details → citizenship
  and BPL check → request text → CAPTCHA.
- Email typed twice. Address split across three unlabelled lines.
- Asks **gender**, **rural or urban**, and **educational status
  (literate / illiterate)** — none of which change your rights under the Act.
- Request text capped at 3000 characters with an arbitrary allowed-character
  whitelist.
- PDF filename restriction: "less than 12 alphanumeric characters, no spaces".
- No steps, no progress indicator, no sense of what is optional vs. blocking.

**Guidelines page**
- 21 dense legal-prose bullet points, which the citizen must scroll through and
  tick *"I have read and understood the above guidelines"* **before the form is
  even shown**.
- This is a checklist and a set of status conditions, dressed up as a legal
  document.

**First Appeal form**
- Assumes the citizen already has their registration number and email
  memorised.
- Then makes them solve a **second CAPTCHA**.
- No lookup helper beyond a tiny `?` tooltip.

**FAQ page**
- 26 accordion entries, several of which are themselves dense technical
  explanations — Q25 lists seven raw "payment failure reasons", Q26 is a
  paragraph justifying OTP cybersecurity policy to a confused citizen.

**The core observation:** the citizen's job here is genuinely simple — *"ask a
government office a question, and find out what happened to it"* — and it is
buried under registration numbers, character whitelists and a 21-point legal
wall.

## 3. The guiding principle

Stated directly in the discussion:

> "We should make the UX in such a way that there is less bullshit and people
> get what they have come for."

Everything below is downstream of that sentence.

## 4. The turn that defined the product

The first pass of ideas was ordinary redesign work — a guided wizard, a status
tracker. Then came the question that changed the scope:

> "What if the person in the lower level doesn't reply in the given time?
> We should focus more on the edge cases."

This reframed the problem. The interesting part of RTI is not the happy path of
filing a request. It is **what happens when the system fails you** — and that is
exactly where the current portal offers nothing.

### The real failure branches

Mapped from the RTI Act flowchart the portal itself displays:

| Branch | What the portal does today |
|---|---|
| No reply in 30 days | Nothing. In law this is already a "deemed refusal" and grounds for appeal — but you must know that yourself. |
| Request transferred to another authority (s.6(3)) | Status changes, new registration number issued. No explanation of what to expect. |
| Reply arrives but is unsatisfactory | Same appeal right, different trigger. Not surfaced. |
| Additional fee demanded mid-process | You must notice it via "View Status" or an email that may not arrive. |
| First Appeal not decided in 45 days | Right to Second Appeal to the CIC. Almost no citizen learns this exists. |
| Wrong authority selected | Application returned **without refund**. |

### Then the second turn

> "RTI is a right for every Indian… there should be some consequences when that
> is not properly done from the Government side. We should give them a sense
> that they are living in an India where everything is transparent, and
> everything delayed will have repercussions."

This is the idea the whole product now hangs on — and crucially, **it required
no invention**.

**Section 20 of the RTI Act, 2005** already provides that a Public Information
Officer who fails to answer within the time limit without reasonable cause is
liable to a penalty of **₹250 per day, capped at ₹25,000**, recoverable from
their salary and imposed by the Information Commission.

That provision has existed for twenty years. Almost no citizen invokes it,
because nothing in the process ever tells them it exists. Making it visible is
not a new power — it is the same power, finally shown to the person it belongs
to.

This replaced the weaker "additional fee demanded" edge case in the final cut.

## 5. The design rules that came out of it

**Rule 1 — Ground-reality annotations.**
> "Beside each field, we should tell them what will be happening on the real
> ground, and if things are not going as they should, how we will be taking
> actions."

Always-visible microcopy under each field (not hover tooltips — hidden
information is exactly the bullshit being removed), explaining what happens on
the government's side when you fill it in.

**Rule 2 — Plain language leads, official terms follow.**
Triggered by the observation that the product must work for a layman. An
official registration number like `MOEDU/R/E/26/00267` is technically authentic
but is itself a piece of bureaucratic friction — a citizen should not have to
hold it in their head to understand their own case.

So: official codes and terms are **always present** (you need them to call a
department or quote a section) but **never load-bearing in the primary reading
path**. Applied consistently to registration numbers, status labels, department
names, and the Ground For Appeal dropdown.

> *"Official language never disappears. It just never goes first."*

**Rule 3 — Proactive, not informational.**
The system does the legal-literacy work *for* the citizen rather than leaving
them to independently discover their rights in a 21-point guideline wall. The
day the deadline passes, the interface says so and offers the appeal.

## 6. Edge cases in the final cut

1. **No Response Within the Time Limit** → First Appeal eligibility prompt.
   (This exact phrase is a real option in the portal's own `Ground For Appeal`
   dropdown.)
2. **Multi-CPIO split** → a single request silently divided across several
   offices, each with its own registration number, own clock and own reply,
   shown as one merged case.
3. **Section 20 penalty accrual** → a visible ₹-per-day counter against the
   named officer, layered on top of case 1.

**Deferred to future scope:** additional-payment-demanded, inaccessible-attachment
re-upload. Both are real and documented, but they are one-off states rather than
journeys — weaker demo material.

## 7. What the official manual did and did not contain

The RTI Online citizen User Manual (`um_citizen.pdf`) was extracted in full
before building, to ground the redesign in the real system. Findings:

**Confirmed by the manual:**
- Exact field names, ordering, and the 3000-character limit.
- The `AAAAA/B/C/DD/EEEEE` registration number format (Authority code / R for
  Request or A for Appeal / receipt type / year / 5-digit serial).
- The five real `Ground For Appeal` dropdown values.
- The multi-CPIO split behaviour, with worked examples
  (`DOP&T/R/E/20/07619`, `/1`, `/2`, `/3` — four numbers, four replies).
- Real status strings: `REQUEST TRANSFERRED TO OTHER PUBLIC AUTHORITY`,
  `ADDITIONAL PAYMENT REQUIRED FOR INFORMATION…`, `RTI REQUEST APPLICATION
  RETURNED TO APPLICANT`.
- ₹10 fee, BPL waiver, no fee for First Appeal.

**Notably absent from the manual:**
- The 30-day, 45-day and 90-day deadlines. **Not stated anywhere.**
- Any mention of Section 20, penalties, or the fact that a citizen might be
  entitled to anything when an officer is late.

This matters for how the project is described. The deadlines and the penalty are
real law (RTI Act, 2005) but they come from the Act directly, **not** from the
portal's own documentation. The pitch should say *"per the RTI Act, 2005"* rather
than implying the portal documents any of it — a judge who knows the space would
catch the conflation.

It also sharpens the argument: the portal's own user manual leaves the citizen to
track every deadline and discover every right unaided. That is the gap.

## 8. One decision that was reversed

The original recommendation was to **avoid** a live time-skip control and instead
pre-seed three requests frozen at different stages, on the grounds that a slider
is fragile to operate on stage.

That was wrong, and was corrected. The time machine is the feature that makes
the accountability idea legible in a two-minute demo — you cannot otherwise show
a 30-day silence, a penalty accruing, an appeal unlocking, and that appeal in
turn being ignored. Every request now derives its complete state from a day
number, and the slider plays the whole legal lifecycle in seconds.

## 9. Scope and team

- Two people, Next.js on Vercel.
- Frontend only; backend entirely mocked, per the brief.
- Split: one person owns the filing wizard, the other owns the status tracker
  and accountability views. Shared: data model and UI primitives.
- Judged on the consumer side only — no admin interface.
