"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskBar } from "@/components/mobile/AppBar";
import { ActionBar, PrimaryButton } from "@/components/mobile/ActionBar";
import { Field } from "@/components/mobile/Primitives";
import { detailsErrors, useDraft } from "@/lib/draft";

/* ------------------------------------------------------------------
   Step 3 of 5 — who is asking.

   Five fields are visible. Everything the portal marks optional — phone
   number, rural or urban, literate or illiterate, gender, citizenship —
   sits behind one row, because none of it changes the outcome and all
   of it costs a screen-height on a phone.

   "Confirm Email-ID" is dropped outright. Retyping an address on a
   phone keyboard produces more errors than it catches; a format check
   plus the confirmation email does the same job better.
------------------------------------------------------------------- */

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

export default function DetailsStep() {
  const router = useRouter();
  const { draft, set, markDone } = useDraft();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showOptional, setShowOptional] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const errors = detailsErrors(draft);
  const show = (k: string) => (touched[k] ? errors[k] : undefined);
  const blur = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  return (
    <>
      <TaskBar
        step={3}
        total={5}
        onBack={() => router.push("/file-request/question")}
      />

      <div className="m-col m-page--action pt-5">
        <h1 className="m-h1">Who is asking?</h1>
        <p className="m-body mt-2">
          The law requires your name and address on every RTI. The officer sees
          them.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <Field label="Full name" error={show("name")}>
            <input
              className="m-field"
              autoComplete="name"
              value={draft.name}
              aria-invalid={Boolean(show("name"))}
              onBlur={() => blur("name")}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>

          <Field
            label="Email — where the reply goes"
            error={show("email")}
            hint="Your RTI number is sent here."
          >
            <input
              className="m-field"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={draft.email}
              aria-invalid={Boolean(show("email"))}
              onBlur={() => blur("email")}
              onChange={(e) => set({ email: e.target.value })}
            />
          </Field>

          {/* Known from sign-in. Shown, not asked for again. */}
          <div>
            <span className="m-label">Mobile</span>
            <div className="m-field flex items-center gap-2 bg-canvas">
              <span className="m-mono flex-1 text-ink">+91 {draft.mobile}</span>
              <span className="m-fine">Used for SMS alerts</span>
            </div>
          </div>

          <Field label="Address" error={show("address")}>
            <textarea
              className="m-field resize-y"
              rows={2}
              autoComplete="street-address"
              value={draft.address}
              aria-invalid={Boolean(show("address"))}
              onBlur={() => blur("address")}
              onChange={(e) => set({ address: e.target.value })}
            />
          </Field>

          <div className="flex gap-3">
            <div className="w-[40%]">
              <Field label="Pincode" error={show("pincode")}>
                <input
                  className="m-field m-mono"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={draft.pincode}
                  aria-invalid={Boolean(show("pincode"))}
                  onBlur={() => blur("pincode")}
                  onChange={(e) =>
                    set({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                  }
                />
              </Field>
            </div>
            <div className="min-w-0 flex-1">
              <Field label="State">
                <select
                  className="m-field"
                  value={draft.state}
                  onChange={(e) => set({ state: e.target.value })}
                >
                  <option value="">Select</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* One row for everything the portal marks optional. */}
          <div className="m-card">
            <button
              type="button"
              onClick={() => setShowOptional((v) => !v)}
              className="flex w-full items-center gap-3 text-left"
              aria-expanded={showOptional}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold text-ink">
                  Add optional details
                </span>
                <span className="m-fine mt-0.5 block">
                  Phone, gender, rural or urban, education
                </span>
              </span>
              <span className="m-tap -mr-2 shrink-0 text-[20px] text-muted" aria-hidden>
                {showOptional ? "−" : "+"}
              </span>
            </button>

            {showOptional && (
              <div className="mt-4 flex flex-col gap-4 border-t border-line-2 pt-4">
                <Field label="Phone number">
                  <input
                    className="m-field m-mono"
                    inputMode="tel"
                    autoComplete="tel"
                    value={draft.phone}
                    onChange={(e) => set({ phone: e.target.value })}
                  />
                </Field>
                <Field label="Gender">
                  <select
                    className="m-field"
                    value={draft.gender}
                    onChange={(e) => set({ gender: e.target.value })}
                  >
                    <option value="">Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Third Gender</option>
                  </select>
                </Field>
                <Field label="Where you live">
                  <select
                    className="m-field"
                    value={draft.area}
                    onChange={(e) => set({ area: e.target.value })}
                  >
                    <option value="">Prefer not to say</option>
                    <option>Rural</option>
                    <option>Urban</option>
                  </select>
                </Field>
                <p className="m-fine">
                  You are filing as an Indian citizen — only Indian citizens can
                  file an RTI.
                </p>
              </div>
            )}
          </div>

          <div className="m-note m-note--info">
            The officer must be able to post you papers if the answer is large.
            Your details are not published.
          </div>
        </div>
      </div>

      <ActionBar
        note={
          blocked
            ? "Check the fields marked in red above."
            : undefined
        }
      >
        {/* Not disabled: with several fields, the useful answer to a tap
            is the errors appearing at the fields themselves, not a dead
            button and one generic sentence. */}
        <PrimaryButton
          onClick={() => {
            setTouched({ name: true, email: true, address: true, pincode: true });
            if (Object.keys(errors).length > 0) {
              setBlocked(true);
              document
                .querySelector('[aria-invalid="true"]')
                ?.scrollIntoView({ block: "center", behavior: "smooth" });
              return;
            }
            setBlocked(false);
            markDone("you");
            router.push("/file-request/fee");
          }}
        >
          Continue
        </PrimaryButton>
      </ActionBar>
    </>
  );
}
