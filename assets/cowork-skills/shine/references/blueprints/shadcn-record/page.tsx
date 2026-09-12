/**
 * shadcn record detail — authored reference for the `record` screen.
 *
 * shadcn ships no record-detail block, so this is authored from its primitives
 * (Card, Badge, Button, Separator, Tabs, Table) rather than harvested. It exists
 * because a record page is not a narrow dashboard: the reader arrives already
 * knowing which record they want and needs identity, then the decision, then the
 * evidence behind it — in that order.
 *
 * Structure, and why each part is here:
 *   identity header   who this record is, its state, and the one action that
 *                     changes that state. The primary action sits here, not at
 *                     the bottom, because the reader often acts without reading on.
 *   facts strip       the four fields that decide the action. Not a full field
 *                     dump — a record page that lists sixty fields equally has
 *                     made none of them findable.
 *   decision panel    what is being asked, the recommendation, and the control
 *                     that records it. A rationale is required for a decision,
 *                     so the submit stays disabled until one is written.
 *   evidence tabs     activity, related records, and provenance. Tabs, not
 *                     stacked sections, because these are alternatives the reader
 *                     switches between rather than a sequence they read through.
 *   receipt trail     what has already been recorded against this record, so the
 *                     reader can see they are not the first to touch it.
 */
"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Clock, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const FACTS = [
  { label: "Owner", value: "Morgan Lee" },
  { label: "Stage", value: "Negotiation" },
  { label: "Due", value: "12 Feb" },
  { label: "Value", value: "$209,000" },
];

const ACTIVITY = [
  { when: "2 Feb", who: "Morgan Lee", what: "Moved to Negotiation from Proposal" },
  { when: "28 Jan", who: "Priya Shah", what: "Logged a call: pricing agreed in principle" },
  { when: "19 Jan", who: "System", what: "Renewal date confirmed against the contract" },
];

const RELATED = [
  { name: "Master services agreement", kind: "Contract", state: "Signed" },
  { name: "Security review", kind: "Task", state: "Open" },
  { name: "Q1 expansion", kind: "Opportunity", state: "Qualified" },
];

export default function RecordDetailPage() {
  const [rationale, setRationale] = useState("");
  const [recorded, setRecorded] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8" data-cite="shadcn-record">
      {/* Identity first: who, what state, and the action that changes it. */}
      <header className="flex flex-wrap items-start justify-between gap-4" data-region="record-identity">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Account record</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Zurich — UK claims renewal</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">Negotiation</Badge>
            <span className="text-sm text-muted-foreground">Renewal · Europe · owned by Morgan Lee</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="#source">
              Open in CRM <ExternalLink aria-hidden="true" className="ml-1 size-3" />
            </a>
          </Button>
          <Button size="sm" data-primary>Record decision</Button>
        </div>
      </header>

      <Separator className="my-6" />

      {/* Only the fields that decide the action. */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-region="record-facts">
        {FACTS.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{fact.label}</dt>
            <dd className="mt-1 text-base font-medium tabular-nums">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <Card className="mt-6" data-region="record-decision">
        <CardHeader>
          <CardTitle className="text-base">What this record needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The renewal date passed without a confirmed outcome. Confirm the new date or hand it back
            to the owner with what is missing.
          </p>
          <label className="block text-sm font-medium" htmlFor="rationale">
            Decision and rationale
          </label>
          <Textarea
            id="rationale"
            rows={3}
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            placeholder="Record the judgment, not a status update."
          />
          <div className="flex items-center gap-3">
            {/* A decision without a rationale is not a decision. */}
            <Button
              size="sm"
              disabled={!rationale.trim()}
              onClick={() => setRecorded(`Decision recorded · ${new Date().toISOString().slice(0, 10)}`)}
            >
              <Check aria-hidden="true" className="mr-1 size-4" /> Record decision
            </Button>
            <p className="text-sm text-muted-foreground" role="status" data-record-status>
              {recorded ?? "Nothing recorded on this record yet."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternatives the reader switches between, not a sequence. */}
      <Tabs defaultValue="activity" className="mt-6" data-region="record-evidence">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
          <TabsTrigger value="source" id="source">Provenance</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Table data-shine-contract="presentation">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">When</TableHead>
                <TableHead className="w-40">Who</TableHead>
                <TableHead>What changed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACTIVITY.map((row) => (
                <TableRow key={row.when}>
                  <TableCell className="tabular-nums text-muted-foreground">{row.when}</TableCell>
                  <TableCell>{row.who}</TableCell>
                  <TableCell>{row.what}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="related">
          <ul className="divide-y">
            {RELATED.map((item) => (
              <li key={item.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.kind}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.state}</Badge>
                  <Button variant="ghost" size="sm" data-row-action>
                    Open <ArrowUpRight aria-hidden="true" className="ml-1 size-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="source">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4" /> Read from Salesforce · 2 Feb, 09:14
            </p>
            <p>Fields shown are the record's own; nothing on this page is derived or inferred.</p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
