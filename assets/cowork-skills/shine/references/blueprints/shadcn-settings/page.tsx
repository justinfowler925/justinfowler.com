/**
 * shadcn settings — authored reference for the `settings` screen.
 *
 * shadcn ships no settings block, so this is composed from its primitives. The
 * region map and the reasoning live in corpus/blueprints/shadcn-settings.md.
 *
 * The one problem this screen has to solve is findability: the reader came to
 * change exactly one thing and does not know which section holds it. So every
 * section name stays visible at rest, each section says what it governs, and
 * save is per-section rather than one global commit at the bottom.
 */
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SECTIONS = [
  { id: "account", name: "Account", purpose: "Who you are on this workspace and how we reach you." },
  { id: "notifications", name: "Notifications", purpose: "What we tell you about, and where." },
  { id: "access", name: "Access", purpose: "Who else can read and change this workspace." },
  { id: "danger", name: "Danger", purpose: "Actions that cannot be undone." },
];

/** A section owns its own dirty state, because save is per-section. */
function useSection<T extends Record<string, unknown>>(loaded: T) {
  const [value, setValue] = useState(loaded);
  const [saved, setSaved] = useState<string | null>(null);
  const dirty = Object.keys(loaded).some((k) => value[k] !== loaded[k]);
  const set = <K extends keyof T>(key: K, next: T[K]) => {
    setValue((prev) => ({ ...prev, [key]: next }));
    setSaved(null);
  };
  return { value, set, dirty, saved, save: () => setSaved("Saved.") };
}

/** Label, control, helper — one row, not one card. Twelve cards read as twelve equal decisions. */
function FieldRow({
  label, helper, htmlFor, children,
}: { label: string; helper: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="min-w-56 flex-1">
        <Label htmlFor={htmlFor} className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-sm text-muted-foreground">{helper}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionSave({ dirty, saved, onSave }: { dirty: boolean; saved: string | null; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-4">
      <Button size="sm" disabled={!dirty} onClick={onSave}>Save changes</Button>
      {/* Mounted at rest with resting copy: a live region created on first save is never announced. */}
      <p className="text-sm text-muted-foreground" role="status">
        {saved ?? (dirty ? "Unsaved changes in this section." : "No changes in this section.")}
      </p>
    </div>
  );
}

export default function SettingsPage() {
  const account = useSection({ name: "Morgan Lee", email: "morgan@example.com" });
  const notifications = useSection({ digest: "weekly", mentions: true, deals: false });
  const [confirm, setConfirm] = useState("");

  return (
    <main className="mx-auto max-w-6xl px-6 py-8" data-cite="shadcn-settings">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes apply to this workspace only.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* The section list is this page's table of contents and its search substitute,
            so every name stays visible at rest. On narrow hosts it becomes a Select —
            never an accordion, which would hide the names. */}
        <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
          <ul className="hidden gap-1 lg:flex lg:flex-col">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {section.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="lg:hidden">
            <Label htmlFor="jump" className="text-sm">Jump to section</Label>
            <Select defaultValue="account">
              <SelectTrigger id="jump" className="mt-1 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTIONS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </nav>

        <div className="min-w-0 flex-1 space-y-10">
          {/* scroll-mt keeps the heading clear of a sticky header when the anchor lands. */}
          <section id="account" className="scroll-mt-20">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">{SECTIONS[0].purpose}</p>
            <Separator className="mt-4" />
            <div className="divide-y">
              <FieldRow label="Display name" helper="Shown on records you own." htmlFor="name">
                <Input
                  id="name" className="w-64" value={account.value.name}
                  onChange={(e) => account.set("name", e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Email" helper="Used for sign-in and every notification below." htmlFor="email">
                <Input
                  id="email" type="email" className="w-64" value={account.value.email}
                  onChange={(e) => account.set("email", e.target.value)}
                />
              </FieldRow>
            </div>
            <SectionSave dirty={account.dirty} saved={account.saved} onSave={account.save} />
          </section>

          <section id="notifications" className="scroll-mt-20">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">{SECTIONS[1].purpose}</p>
            <Separator className="mt-4" />
            <div className="divide-y">
              <FieldRow label="Summary email" helper="A digest of what changed on your records." htmlFor="digest">
                <Select value={notifications.value.digest} onValueChange={(v) => notifications.set("digest", v)}>
                  <SelectTrigger id="digest" className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              {/* Labels are the reader's words. "Mentions", not notify_mention_flag. */}
              <FieldRow label="Mentions" helper="When someone names you in a note." htmlFor="mentions">
                <Switch
                  id="mentions" checked={notifications.value.mentions}
                  onCheckedChange={(v) => notifications.set("mentions", v)}
                />
              </FieldRow>
              <FieldRow label="Deal movement" helper="When a deal you own changes stage." htmlFor="deals">
                <Switch
                  id="deals" checked={notifications.value.deals}
                  onCheckedChange={(v) => notifications.set("deals", v)}
                />
              </FieldRow>
            </div>
            <SectionSave dirty={notifications.dirty} saved={notifications.saved} onSave={notifications.save} />
          </section>

          <section id="access" className="scroll-mt-20">
            <h2 className="text-lg font-semibold">Access</h2>
            <p className="mt-1 text-sm text-muted-foreground">{SECTIONS[2].purpose}</p>
            <Separator className="mt-4" />
            <ul className="divide-y">
              {[
                { who: "Priya Shah", role: "Can edit" },
                { who: "Sam Okafor", role: "Can view" },
              ].map((member) => (
                <li key={member.who} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">{member.who}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  {/* Visible at rest, not on hover: usability requires it present at load. */}
                  <Button variant="ghost" size="sm">Change</Button>
                </li>
              ))}
            </ul>
          </section>

          {/* Destructive last, visually separated, and the confirm names what is lost. */}
          <section id="danger" className="scroll-mt-20">
            <h2 className="text-lg font-semibold">Danger</h2>
            <p className="mt-1 text-sm text-muted-foreground">{SECTIONS[3].purpose}</p>
            <div className="mt-4 rounded-lg border border-destructive/40 p-4">
              <p className="text-sm font-medium">Delete this workspace</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Deletes 1,204 records, 38 saved views, and every audit receipt. Not recoverable.
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div>
                  <Label htmlFor="confirm" className="text-sm">Type the workspace name to confirm</Label>
                  <Input
                    id="confirm" className="mt-1 w-64" placeholder="Revenue Operations"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                <Button variant="destructive" size="sm" disabled={confirm !== "Revenue Operations"}>
                  Delete workspace
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
