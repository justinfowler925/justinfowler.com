# Usability proof — references become working objects

Visual similarity and accessibility are necessary but do not establish that a person can complete a job. Every existing or new product surface therefore carries a small `shine-usability.json` beside its design diagnosis/spec and proves it in a real browser.

```json
{
  "version": 1,
  "cite": "untitled-table",
  "objects": [
    {"id":"queue","selector":"[data-testid=queue]","referenceRole":"table","purpose":"See work needing a decision"},
    {"id":"capture","selector":"[data-testid=capture]","referenceRole":"command","purpose":"Add work without leaving the queue"}
  ],
  "flows": [{"id":"capture-work","userJob":"Capture work and see it enter the queue","steps":[
    {"action":"fill","selector":"[data-testid=capture]","value":"Call Acme"},
    {"action":"press","selector":"[data-testid=capture]","value":"Enter"},
    {"action":"text","selector":"[data-testid=queue]","value":"Call Acme"}
  ]}]
}
```

- `cite` is the selected Shadcn, Untitled UI, or other corpus reference. `compare` proves its page structure; this contract proves the selected reference objects exist and work for this product’s job.
- Each object has a stable selector, the reference role it implements, and a user-facing purpose. All required roles from the reference template must be present.
- Each flow has at least three observable steps and at least one real user action (`click`, `fill`, or `press`). Screenshot-only, assertion-only, and invented-object flows fail.
- Valid actions: `click`, `fill`, `press`, `visible`, `hidden`, `text`, and `value`.

Run this after measure and before compare:

```sh
node verify/usability.mjs http://127.0.0.1:3000 --contract shine-usability.json --cite untitled-table
```

If the product cannot declare its primary job in executable steps, do not polish it. Resolve the workflow first.
