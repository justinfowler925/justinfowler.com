/**
 * shadcn weekly cadence board — authored reference for `weekly-board`.
 *
 * shadcn publishes the primitives used here, but no composed board or kanban
 * block. This page turns the region contract in the sibling Markdown file into
 * copyable source: Button, Card, Badge, Separator and the normal HTML list
 * semantics supplied by a shadcn host. It is intentionally not a DataGrid.
 */
"use client";

import { useState } from "react";
import { AlertTriangle, Check, Circle, RefreshCw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Outcome = "unreported" | "met" | "off-track";

const OWNERS = ["All", "Revenue", "Product", "Operations", "People"];
const OUTCOME: Record<Outcome, { label: string; icon: typeof Circle }> = {
  unreported: { label: "Unreported", icon: Circle },
  met: { label: "Met", icon: Check },
  "off-track": { label: "Off track", icon: X },
};

const LAST_PERIOD = [
  { id: 1, owner: "Revenue", commitment: "Confirm the enterprise renewal plan", outcome: "met" as Outcome },
  { id: 2, owner: "Product", commitment: "Ship the reviewer workflow to pilot", outcome: "off-track" as Outcome },
  { id: 3, owner: "Operations", commitment: "Close the onboarding handoff gaps", outcome: "unreported" as Outcome },
  { id: 4, owner: "People", commitment: "Publish the manager enablement plan", outcome: "met" as Outcome },
];

const CURRENT = [
  { owner: "Revenue", commitment: "Put the renewal forecast in front of ELT", objective: "Durable growth" },
  { owner: "Product", commitment: "Resolve pilot feedback and set the release boundary", objective: "Trusted product" },
  { owner: "Operations", commitment: "Cut time-to-ready for the next customer cohort", objective: "Operational scale" },
];

const NEXT = [
  { due: "Sep 11", owner: "People", commitment: "Run the manager calibration session" },
  { due: "Sep 18", owner: "Revenue", commitment: "Lock the Q4 account plan" },
];

const STANDING = [
  { owner: "Security", commitment: "Review critical risk and control changes" },
  { owner: "Finance", commitment: "Reconcile forecast movement against plan" },
];

const nextOutcome = (value: Outcome): Outcome =>
  value === "unreported" ? "met" : value === "met" ? "off-track" : "unreported";

export default function WeeklyBoardPage() {
  const [owner, setOwner] = useState("All");
  const [rows, setRows] = useState(LAST_PERIOD);
  const [announcement, setAnnouncement] = useState("No report-out changes yet.");
  const [freshness, setFreshness] = useState("Synced 8 minutes ago");

  const visible = rows.filter((row) => owner === "All" || row.owner === owner);
  const reported = rows.filter((row) => row.outcome !== "unreported").length;
  const met = rows.filter((row) => row.outcome === "met").length;
  const offTrack = rows.filter((row) => row.outcome === "off-track");

  const record = (id: number) => {
    const current = rows.find((row) => row.id === id);
    if (!current) return;
    const outcome = nextOutcome(current.outcome);
    setRows((value) => value.map((row) => row.id === id ? { ...row, outcome } : row));
    setAnnouncement(`${current.commitment}: ${OUTCOME[outcome].label}.`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground" data-cite="shadcn-weekly-board">
      <header className="bg-zinc-950 text-zinc-50" data-region="weekly-summary" data-summary>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 py-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">ELT weekly cadence</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Week ending 4 September</h1>
            <p className="mt-2 text-sm text-zinc-400">{freshness} · Google Sheet snapshot</p>
          </div>
          <Button
            className="bg-white text-zinc-950 hover:bg-zinc-200"
            data-primary
            onClick={() => setFreshness("Synced just now")}
          >
            <RefreshCw aria-hidden="true" className="mr-2 size-4" /> Refresh source
          </Button>
          <dl className="grid w-full grid-cols-3 gap-3 border-t border-zinc-800 pt-6 sm:w-auto sm:min-w-[28rem] sm:border-0 sm:pt-0">
            {[
              ["Reported", `${reported} / ${rows.length}`],
              ["Met", String(met)],
              ["Off track", String(offTrack.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-zinc-400">{label}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <nav aria-label="Meeting owners" data-region="owner-navigation">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Walk the agenda by owner</p>
          <div className="flex flex-wrap gap-2">
            {OWNERS.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={owner === name ? "default" : "outline"}
                aria-pressed={owner === name}
                onClick={() => setOwner(name)}
              >
                {name}
              </Button>
            ))}
          </div>
        </nav>

        <Separator />

        <section data-region="last-period-report-out">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last period</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Report out</h2>
            </div>
            <p role="status" className="text-sm text-muted-foreground">{announcement}</p>
          </div>
          <ul className="overflow-hidden rounded-xl border bg-card">
            {visible.map((row, index) => {
              const state = OUTCOME[row.outcome];
              const Icon = state.icon;
              return (
                <li key={row.id} className={`flex flex-wrap items-center gap-4 p-4 ${index ? "border-t" : ""}`}>
                  <Badge variant="outline" className="w-24 justify-center">{row.owner}</Badge>
                  <p className="min-w-64 flex-1 text-sm font-medium">{row.commitment}</p>
                  <Button variant="outline" size="sm" onClick={() => record(row.id)}>
                    <Icon aria-hidden="true" className="mr-2 size-4" /> {state.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>

        <section data-region="current-period">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current period</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Committed now</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {CURRENT.filter((item) => owner === "All" || item.owner === owner).map((item) => (
              <Card key={item.commitment}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline">{item.owner}</Badge>
                    <span className="text-xs text-muted-foreground">{item.objective}</span>
                  </div>
                  <CardTitle className="pt-3 text-base leading-snug">{item.commitment}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section data-region="discuss" className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <div className="flex items-center gap-2">
            <AlertTriangle aria-hidden="true" className="size-5" />
            <h2 className="text-lg font-semibold">Discuss</h2>
            <Badge variant="outline" className="ml-auto border-amber-400">{offTrack.length}</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {offTrack.map((row) => (
              <li key={row.id} className="rounded-lg bg-white/80 p-4">
                <p className="text-sm font-medium">{row.commitment}</p>
                <p className="mt-1 text-sm text-amber-800">Pilot feedback changed the release boundary; ELT needs to choose scope.</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" data-region="next-and-standing">
          <Card>
            <CardHeader><CardTitle className="text-base">Up next</CardTitle></CardHeader>
            <CardContent><ul className="divide-y">{NEXT.map((item) => (
              <li key={item.commitment} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                <time className="w-16 shrink-0 text-sm font-medium tabular-nums">{item.due}</time>
                <div><p className="text-sm font-medium">{item.commitment}</p><p className="text-xs text-muted-foreground">{item.owner}</p></div>
              </li>
            ))}</ul></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Standing</CardTitle></CardHeader>
            <CardContent><ul className="divide-y">{STANDING.map((item) => (
              <li key={item.commitment} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{item.commitment}</p><p className="text-xs text-muted-foreground">{item.owner}</p>
              </li>
            ))}</ul></CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
