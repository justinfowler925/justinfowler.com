/**
 * shadcn wizard — authored reference for the `wizard` screen.
 *
 * shadcn ships no stepper primitive and no wizard block, so both the indicator
 * and the flow are composed here. The region map and the reasoning live in
 * corpus/blueprints/shadcn-wizard.md.
 *
 * A wizard is only justified when the task cannot be validated all at once. The
 * two things that make one work are both easy to omit: state that survives going
 * back, and a review step that restates every answer before the commit.
 */
"use client";

import { useRef, useState } from "react";
import { AlertCircle, Check } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Answers = {
  account: string;
  region: string;
  owner: string;
  justification: string;
};

const STEPS = [
  { id: "account", name: "Account", decides: "Which account this request is against." },
  { id: "scope", name: "Scope", decides: "Where it applies and who owns it." },
  { id: "justification", name: "Justification", decides: "Why it should be approved." },
  { id: "review", name: "Review", decides: "Confirm every answer before it is submitted." },
] as const;

/** Required fields per step. Validation runs on advance, not on every blur. */
const REQUIRED: Record<number, (keyof Answers)[]> = {
  0: ["account"],
  1: ["region", "owner"],
  2: ["justification"],
  3: [],
};

const LABELS: Record<keyof Answers, string> = {
  account: "Account",
  region: "Region",
  owner: "Owner",
  justification: "Justification",
};

/** Which step set each answer, so the review step can link back to it. */
const SET_BY_STEP: Record<keyof Answers, number> = {
  account: 0,
  region: 1,
  owner: 1,
  justification: 2,
};

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  // One answers object held above the steps, so going back never clears a step.
  const [answers, setAnswers] = useState<Answers>({ account: "", region: "", owner: "", justification: "" });
  const [blocked, setBlocked] = useState<(keyof Answers)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setBlocked((prev) => prev.filter((k) => k !== key));
  };

  const goTo = (next: number) => {
    setStep(next);
    setFurthest((prev) => Math.max(prev, next));
    // Move focus to the new step's heading, or a keyboard reader stays stranded
    // at the bottom of the step they just left.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const advance = () => {
    const missing = REQUIRED[step].filter((key) => !String(answers[key]).trim());
    if (missing.length) {
      setBlocked(missing);
      return;
    }
    setBlocked([]);
    if (step === STEPS.length - 1) setSubmitted(true);
    else goTo(step + 1);
  };

  const current = STEPS[step];

  return (
    <main className="mx-auto max-w-2xl px-6 py-8" data-cite="shadcn-wizard">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Request an exception</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Four steps. Nothing is submitted until you confirm on the last one.
        </p>
      </header>

      {/* Numbered markers are correct here and only here: the order is information the
          reader needs. State is carried by shape and text, never colour alone. */}
      <nav aria-label="Progress" className="mt-6">
        <ol className="flex flex-wrap gap-x-2 gap-y-3">
          {STEPS.map((s, index) => {
            // furthest is never behind step, so this alone marks every visited step.
            const done = index < furthest;
            const isCurrent = index === step;
            const reachable = index <= furthest && !isCurrent;
            const marker = (
              <span
                className={[
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums",
                  isCurrent ? "border-primary bg-primary text-primary-foreground"
                    : done ? "border-foreground/40 bg-muted text-foreground"
                    : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {done && !isCurrent ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
              </span>
            );
            const label = (
              <span className={isCurrent ? "font-medium" : "text-muted-foreground"}>
                {s.name}
                {/* State in text as well as shape, so it survives without colour. */}
                <span className="sr-only">
                  {isCurrent ? " (current step)" : done ? " (completed)" : " (not started)"}
                </span>
              </span>
            );
            return (
              <li key={s.id} className="flex items-center gap-2" aria-current={isCurrent ? "step" : undefined}>
                {/* Completed steps are links back; upcoming steps are not links. */}
                {reachable ? (
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    className="flex items-center gap-2 rounded-md text-sm hover:underline"
                  >
                    {marker}{label}
                  </button>
                ) : (
                  <span className="flex items-center gap-2 text-sm">{marker}{label}</span>
                )}
                {index < STEPS.length - 1 && <span aria-hidden="true" className="ml-1 text-muted-foreground">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      <Separator className="my-6" />

      {submitted ? (
        <div role="status">
          <h2 tabIndex={-1} ref={headingRef} className="text-lg font-semibold">Request submitted</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference EX-4192. The approver has been notified and you will hear back within two working days.
          </p>
        </div>
      ) : (
        <>
          <h2 tabIndex={-1} ref={headingRef} className="text-lg font-semibold outline-none">{current.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{current.decides}</p>

          {/* Summary on failed advance, with each blocked field a link to itself.
              Per-field errors stay at the fields too; this exists so nobody hunts. */}
          {blocked.length > 0 && (
            <Alert variant="destructive" className="mt-4" role="alert">
              <AlertCircle aria-hidden="true" className="size-4" />
              <AlertTitle>This step needs {blocked.length} more {blocked.length === 1 ? "answer" : "answers"}</AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc">
                  {blocked.map((key) => (
                    <li key={key}><a className="underline" href={`#${key}`}>{LABELS[key]}</a></li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-5 space-y-5">
            {step === 0 && (
              <div>
                <Label htmlFor="account">Account</Label>
                <Input
                  id="account" className="mt-1" value={answers.account}
                  onChange={(e) => set("account", e.target.value)}
                  aria-invalid={blocked.includes("account") || undefined}
                />
                <p className="mt-1 text-sm text-muted-foreground">The account the exception applies to.</p>
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select value={answers.region} onValueChange={(v) => set("region", v)}>
                    <SelectTrigger id="region" className="mt-1" aria-invalid={blocked.includes("region") || undefined}>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Americas">Americas</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner" className="mt-1" value={answers.owner}
                    onChange={(e) => set("owner", e.target.value)}
                    aria-invalid={blocked.includes("owner") || undefined}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification" rows={4} className="mt-1" value={answers.justification}
                  onChange={(e) => set("justification", e.target.value)}
                  aria-invalid={blocked.includes("justification") || undefined}
                  placeholder="What the approver needs in order to decide."
                />
              </div>
            )}

            {/* The region most often dropped, and dropping it is why wizards get
                abandoned at the commit. Every answer, with a link back to its step. */}
            {step === 3 && (
              <dl className="divide-y">
                {(Object.keys(LABELS) as (keyof Answers)[]).map((key) => (
                  <div key={key} className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-sm text-muted-foreground">{LABELS[key]}</dt>
                    <dd className="flex items-start gap-3 text-right text-sm">
                      <span className="max-w-sm">{answers[key] || "—"}</span>
                      <button
                        type="button"
                        className="shrink-0 underline text-muted-foreground"
                        onClick={() => goTo(SET_BY_STEP[key])}
                      >
                        Change<span className="sr-only"> {LABELS[key]}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
              Back
            </Button>
            {/* Enabled, and validates on click. A disabled Continue with no stated
                reason leaves the reader with nothing to fix. The final action is
                named for what it does — never "Finish". */}
            <Button onClick={advance}>
              {step === STEPS.length - 1 ? "Submit request" : "Continue"}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
