"use client";

import React, { useMemo, useRef, useState } from "react";

type PrimaryService =
  | "get_counsel"
  | "legal_drafting"
  | "liaison_lawyers"
  | "courtroom_tech"
  | "advocate_vigilance"
  | "document_review"
  | "legal_assessment"
  | "";

type Urgency = "standard_24_48" | "within_6" | "within_2";

const FEES = {
  base: 1500,
  urgency: {
    standard_24_48: 0,
    within_6: 500,
    within_2: 1000,
  } satisfies Record<Urgency, number>,
};

const PRIMARY_SERVICES: { key: PrimaryService; label: string; desc: string }[] = [
  { key: "get_counsel", label: "Get a Counsel", desc: "Book a lawyer consultation slot." },
  { key: "legal_drafting", label: "Legal Drafting", desc: "Contracts, notices, agreements, etc." },
  { key: "liaison_lawyers", label: "Liaison Lawyers", desc: "On-ground coordination and filings." },
  { key: "courtroom_tech", label: "Courtroom Tech", desc: "Hearing support, e-briefs, video setups." },
  { key: "advocate_vigilance", label: "Advocate Vigilance", desc: "Track status, follow-ups, compliance." },
  { key: "document_review", label: "Document Review", desc: "Review and risk highlighting." },
  { key: "legal_assessment", label: "Legal Assessment", desc: "Initial assessment + recommended path." },
];

const LEGAL_DOMAINS = [
  "Corporate, Commercial and Startups",
  "Family and Matrimonial",
  "Property and Real Estate",
  "Criminal Matters",
  "Civil & Consumer Disputes",
  "NRI Specific Services",
  "Employment & Labor",
  "Other",
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/70">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-medium text-white/90">{label}</span>
        {required ? <span className="text-xs text-amber-300">*</span> : null}
      </div>
      {children}
      {hint ? <div className="mt-1 text-xs text-white/55">{hint}</div> : null}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none",
        "placeholder:text-white/35 focus:border-white/25 focus:ring-2 focus:ring-white/10",
        props.className
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full min-h-[110px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none",
        "placeholder:text-white/35 focus:border-white/25 focus:ring-2 focus:ring-white/10",
        props.className
      )}
    />
  );
}

function PillRadio<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; sub?: string }>;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl border px-3 py-3 text-left transition",
            value === o.value
              ? "border-white/25 bg-white/10"
              : "border-white/10 bg-white/5 hover:bg-white/8"
          )}
        >
          <div className="text-sm font-semibold text-white">{o.label}</div>
          {o.sub ? <div className="mt-1 text-xs text-white/65">{o.sub}</div> : null}
        </button>
      ))}
    </div>
  );
}

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function SectionHeader({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-sm font-semibold text-white/90">{k}</div>
      {v ? <div className="text-xs text-white/55">{v}</div> : null}
    </div>
  );
}

export default function BookingFormPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  // OTP UI state (demo only)
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);

  // Step 2 fields
  const [primaryService, setPrimaryService] = useState<PrimaryService>("");
  const [legalDomain, setLegalDomain] = useState<(typeof LEGAL_DOMAINS)[number] | "">("");
  const [caseDetails, setCaseDetails] = useState("");
  const [consultMode, setConsultMode] = useState<"audio" | "video" | "in_person" | "">("");
  const [preferredDate, setPreferredDate] = useState("2026-02-20");
  const [timeWindow, setTimeWindow] = useState("12:00 PM - 02:00 PM");
  const [urgency, setUrgency] = useState<Urgency>("standard_24_48");
  const [pastLegalAction, setPastLegalAction] = useState<"yes" | "no" | "">("");

  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isCounsel = primaryService === "get_counsel";

  const total = useMemo(() => {
    return FEES.base + FEES.urgency[urgency];
  }, [urgency]);

  const canGoStep2 = useMemo(() => {
    // minimal “demo validation”
    const basicOk =
      name.trim().length > 1 &&
      gender !== "" &&
      email.includes("@") &&
      phone.trim().length >= 8 &&
      nationality.trim().length > 1 &&
      address.trim().length > 5;

    // In a real app you’d require verified OTP; for demo, allow either verified OR not used.
    const emailOk = emailOtpVerified || !emailOtpSent;
    const phoneOk = phoneOtpVerified || !phoneOtpSent;

    return basicOk && emailOk && phoneOk;
  }, [
    name,
    gender,
    email,
    phone,
    nationality,
    address,
    emailOtpVerified,
    phoneOtpVerified,
    emailOtpSent,
    phoneOtpSent,
  ]);

  const counselReady = useMemo(() => {
    if (!isCounsel) return false;
    return (
      legalDomain !== "" &&
      caseDetails.trim().length >= 10 &&
      consultMode !== "" &&
      preferredDate !== "" &&
      timeWindow !== "" &&
      urgency !== "" &&
      pastLegalAction !== ""
    );
  }, [isCounsel, legalDomain, caseDetails, consultMode, preferredDate, timeWindow, urgency, pastLegalAction]);

  const readyToBook = useMemo(() => {
    if (primaryService === "") return false;
    if (isCounsel) return counselReady;
    // for other services (UI demo), just require primary service.
    return true;
  }, [primaryService, isCounsel, counselReady]);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  }

  function serviceLabel(key: PrimaryService) {
    return PRIMARY_SERVICES.find((s) => s.key === key)?.label ?? "Service";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070A12] via-[#070A12] to-[#0B1020] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Expandable Booking Form (Client Demo)</h1>
          <p className="text-sm text-white/70">
            UI-only (no backend). Step 2 expands after Step 1. “Get a Counsel” reveals full flow and pricing summary.
          </p>

          {/* Stepper */}
          <div className="mt-4 flex items-center gap-3">
            <div className={cn("h-9 w-9 rounded-xl grid place-items-center border",
              step === 1 ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5")}>
              1
            </div>
            <div className={cn("h-1 flex-1 rounded", step === 2 ? "bg-white/25" : "bg-white/10")} />
            <div className={cn("h-9 w-9 rounded-xl grid place-items-center border",
              step === 2 ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5")}>
              2
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* STEP 1 */}
          <Card title="Step 1 — Basic Details" subtitle="This is always visible first.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
              </Field>

              <Field label="Gender" required>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10"
                >
                  <option value="" className="bg-[#0B1020]">Select</option>
                  <option value="male" className="bg-[#0B1020]">Male</option>
                  <option value="female" className="bg-[#0B1020]">Female</option>
                  <option value="other" className="bg-[#0B1020]">Other</option>
                </select>
              </Field>

              <Field label="Email" required>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
              </Field>

              <Field label="Email verification OTP" hint="Demo UI only">
                <div className="flex gap-2">
                  <Input
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="Enter OTP"
                    disabled={!emailOtpSent}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEmailOtpSent(true);
                      setEmailOtpVerified(false);
                      setEmailOtp("");
                    }}
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    {emailOtpSent ? "Resend" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailOtpVerified(emailOtp.trim().length >= 4)}
                    disabled={!emailOtpSent}
                    className={cn(
                      "shrink-0 rounded-xl px-3 py-2 text-sm border",
                      emailOtpVerified
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
                    )}
                  >
                    {emailOtpVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </Field>

              <Field label="Phone No." required>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98XXXXXX12" />
              </Field>

              <Field label="Phone no OTP verification" hint="Demo UI only">
                <div className="flex gap-2">
                  <Input
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    placeholder="Enter OTP"
                    disabled={!phoneOtpSent}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneOtpSent(true);
                      setPhoneOtpVerified(false);
                      setPhoneOtp("");
                    }}
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    {phoneOtpSent ? "Resend" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoneOtpVerified(phoneOtp.trim().length >= 4)}
                    disabled={!phoneOtpSent}
                    className={cn(
                      "shrink-0 rounded-xl px-3 py-2 text-sm border",
                      phoneOtpVerified
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
                    )}
                  >
                    {phoneOtpVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </Field>

              <Field label="Nationality" required>
                <Input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Indian" />
              </Field>

              <Field label="Date of birth (optional)">
                <Input value={dob} onChange={(e) => setDob(e.target.value)} type="date" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address" required>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, street, city, state, country"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-white/60">
                Step 2 unlocks when required fields look valid (demo rule).
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canGoStep2}
                className="rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-40"
              >
                Continue to Services
              </button>
            </div>
          </Card>

          {/* STEP 2 (expands) */}
          <Collapse open={step === 2}>
            <div className="grid gap-6">
              <Card title="Step 2 — Select Primary Service" subtitle="This screen expands after Step 1.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {PRIMARY_SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      onClick={() => setPrimaryService(s.key)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition",
                        primaryService === s.key
                          ? "border-white/25 bg-white/10"
                          : "border-white/10 bg-white/5 hover:bg-white/8"
                      )}
                    >
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="mt-1 text-xs text-white/65">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* GET A COUNSEL flow (conditional expansion) */}
              <Collapse open={isCounsel}>
                <div className="grid gap-6">
                  <Card
                    title="Get a Counsel — Legal Domain"
                    subtitle="Which category does your case fall under?"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LEGAL_DOMAINS.map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setLegalDomain(d)}
                          className={cn(
                            "rounded-xl border px-3 py-3 text-left text-sm transition",
                            legalDomain === d
                              ? "border-white/25 bg-white/10"
                              : "border-white/10 bg-white/5 hover:bg-white/8"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card title="Case Details" subtitle="Describe the specific issue clearly.">
                    <div className="grid gap-4">
                      <Field label="Describe the issue" required hint='Example: "I need a review of a builder buyer agreement for a property in Noida..."'>
                        <Textarea
                          value={caseDetails}
                          onChange={(e) => setCaseDetails(e.target.value)}
                          placeholder="Write details here..."
                        />
                      </Field>

                      <div>
                        <SectionHeader k="Upload Documents" v="UI only" />
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => fileRef.current?.click()}
                          className="mt-2 cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-center hover:bg-white/8"
                        >
                          <div className="text-sm font-semibold">Click to upload or drag & drop</div>
                          <div className="mt-1 text-xs text-white/60">PDF, DOCX, images — (demo; not uploaded anywhere)</div>
                          <input
                            ref={fileRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const chosen = Array.from(e.target.files || []);
                              if (chosen.length) setFiles((prev) => [...prev, ...chosen]);
                            }}
                          />
                        </div>

                        {files.length ? (
                          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
                            <div className="text-xs font-semibold text-white/80">Selected files</div>
                            <ul className="mt-2 space-y-1 text-xs text-white/70">
                              {files.map((f, idx) => (
                                <li key={`${f.name}-${idx}`} className="flex items-center justify-between gap-3">
                                  <span className="truncate">{f.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Card>

                  <Card title="Preferred Consultation Mode">
                    <PillRadio
                      value={consultMode}
                      onChange={setConsultMode}
                      options={[
                        { value: "audio", label: "Audio Call" },
                        { value: "video", label: "Video Call" },
                        { value: "in_person", label: "In-Person" },
                      ]}
                    />
                  </Card>

                  <Card title="Timing & Urgency">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Preferred Date" required>
                        <Input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                        />
                      </Field>

                      <Field label="Time Window" required>
                        <select
                          value={timeWindow}
                          onChange={(e) => setTimeWindow(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10"
                        >
                          {[
                            "10:00 AM - 12:00 PM",
                            "12:00 PM - 02:00 PM",
                            "02:00 PM - 04:00 PM",
                            "04:00 PM - 06:00 PM",
                            "06:00 PM - 08:00 PM",
                          ].map((t) => (
                            <option key={t} value={t} className="bg-[#0B1020]">
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <div className="sm:col-span-2">
                        <SectionHeader k="Urgency Level" v="Affects pricing (demo)" />
                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => setUrgency("standard_24_48")}
                            className={cn(
                              "rounded-xl border px-3 py-3 text-left",
                              urgency === "standard_24_48"
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-white/5 hover:bg-white/8"
                            )}
                          >
                            <div className="text-sm font-semibold">Standard</div>
                            <div className="text-xs text-white/65">(24–48 hrs)</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setUrgency("within_6")}
                            className={cn(
                              "rounded-xl border px-3 py-3 text-left",
                              urgency === "within_6"
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-white/5 hover:bg-white/8"
                            )}
                          >
                            <div className="text-sm font-semibold">Immediate</div>
                            <div className="text-xs text-white/65">(Within 6 hrs)</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setUrgency("within_2")}
                            className={cn(
                              "rounded-xl border px-3 py-3 text-left",
                              urgency === "within_2"
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-white/5 hover:bg-white/8"
                            )}
                          >
                            <div className="text-sm font-semibold">Immediate</div>
                            <div className="text-xs text-white/65">(Within 2 hrs)</div>
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <SectionHeader k="Any past legal action?" />
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {(["yes", "no"] as const).map((v) => (
                            <button
                              type="button"
                              key={v}
                              onClick={() => setPastLegalAction(v)}
                              className={cn(
                                "rounded-xl border px-3 py-3 text-left",
                                pastLegalAction === v
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/8"
                              )}
                            >
                              <div className="text-sm font-semibold">{v === "yes" ? "Yes" : "No"}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* READY TO BOOK (final UI before payment) */}
                  <Collapse open={readyToBook}>
                    <Card title="Ready to Book" subtitle={`Your request for ${serviceLabel(primaryService)} is ready.`}>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-white/80">
                          Proceed to payment to block your{" "}
                          <span className="font-semibold">
                            {urgency === "standard_24_48"
                              ? "Standard (24–48 hrs)"
                              : urgency === "within_6"
                                ? "Immediate (Within 6 hrs)"
                                : "Immediate (Within 2 hrs)"}
                          </span>{" "}
                          appointment slot.
                        </p>

                        <div className="mt-4 grid gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Consultation Fee</span>
                            <span className="font-semibold">₹ {FEES.base.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Urgency Surcharge</span>
                            <span className="font-semibold">₹ {FEES.urgency[urgency].toLocaleString("en-IN")}</span>
                          </div>
                          <div className="my-1 h-px bg-white/10" />
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Total</span>
                            <span className="text-lg font-bold">₹ {total.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setPrimaryService("")}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                        >
                          Back
                        </button>

                        <button
                          type="button"
                          onClick={() => alert("Demo UI: redirect to payment gateway here")}
                          className="rounded-xl border border-emerald-400/20 bg-emerald-400/15 px-5 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/20"
                        >
                          Pay &amp; Book
                        </button>
                      </div>
                    </Card>
                  </Collapse>
                </div>
              </Collapse>

              {/* Non-counsel services: show a lighter “ready” card */}
              <Collapse open={primaryService !== "" && !isCounsel}>
                <Card title="Next Step" subtitle="(Demo for other services)">
                  <p className="text-sm text-white/75">
                    You selected <span className="font-semibold">{serviceLabel(primaryService)}</span>.
                    For the UI demo, you can either:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                    <li>Show a tailored form later (similar to “Get a Counsel”).</li>
                    <li>Or directly route to a quote/payment page.</li>
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setPrimaryService("")}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Demo UI: continue flow for this service")}
                      className="rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/15"
                    >
                      Continue
                    </button>
                  </div>
                </Card>
              </Collapse>
            </div>
          </Collapse>
        </div>

        <div className="mt-10 text-xs text-white/50">
          Note: This is **UI only**. When you connect Express/MySQL later, you’ll replace the OTP + payment alerts with real API calls.
        </div>
      </div>
    </div>
  );
}
