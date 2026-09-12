# voice.md — surfaces that speak or listen

Read this when a project adds any of: text-to-speech, a read-aloud mode, a spoken
summary layer, voice commands, dictation. Every rule below was earned on
2026-08-05 building two of them in one day (the Stop-hook speaker and the
Meeting Recon voice mode); the incidents are cited inline.

**The law: a voice layer is a summarizer with manners, never a screen reader.**
Nothing leaves the speaker that a colleague wouldn't say across a desk, and
nothing the mic hears steers the app unless a human meant it to.

---

## Output — write for the mouth, not the eye

- **Never read UI or agent text verbatim.** Summarize to one or two spoken
  sentences: what happened, what needs the listener. "Nothing needs you" is a
  valid and excellent ending.
- **Ban from speech** — things no human says aloud: file paths, commit hashes,
  URLs, version strings, branch names, markdown syntax, emoji, code
  identifiers, raw ISO dates. If the fact matters, translate it ("the deploy
  finished", not "d-p-l underscore three-V-one…").
- **Homographs get rephrased, not trusted.** *live* → "deployed and running" /
  "up". Watch *read, lead, close, record, present, tear, wound* — a TTS engine
  picks the wrong one exactly when it's funniest. Incident: "Live." opened a
  status report and the voice said /lɪv/.
- **Numbers are rounded and spoken with units.** "Contrast about twelve and a
  half to one", never "12.49:1". Four digits max out loud.
- **Month abbreviations become month names before the mouth.** A TTS engine
  reads "Jul" as *Jewel* and "Aug" as a word. Expand Jan–Dec, speak ISO dates
  as dates, expand $1.2M-style suffixes, read ratios as "4.5 to 1". Ship it as
  a deterministic speechify() pass with unit tests — no model needed between
  the page and the voice.
- **Strip eye-chrome at the DOM, not with regex.** Chips, status labels,
  citations and icons are for the eye; clone the row and remove them by class
  before extracting a word. And join sibling text blocks with a real space —
  textContent fuses "DDQ?" and "4 of 47" into one token. Incident: the brief
  read every tag on the bottom of the ticket.
- **Sentence case, no lists.** Speech has no bullets; if the summary needs a
  list, it isn't a summary yet.
- **The browser's speechSynthesis default is never the product's voice.** If a
  surface owns a voice, the product serves the audio: a server-side TTS proxy,
  key never in the client, gated to a verified session so it can't be farmed.
  Web Speech synthesis is only the fallback for when the proxy can't answer.
  Incident: the kit brief shipped on the OS robot lady while the brand voice
  sat one API call away.

## The summarizer harness (LLM → TTS)

- System role in one breath: *you are the spoken-voice layer; reply with one or
  two short spoken sentences, casual, like a colleague leaning over; output
  only the sentences.* Put the write-for-the-mouth bans in the prompt.
- **Disable reasoning traces.** Thinking-mode models leak deliberation as plain
  prose, not tags — `chat_template_kwargs: {enable_thinking: false}` for
  Qwen-class; `/no_think` in the prompt does NOT reliably work through a
  router. Incident: three minutes of chain-of-thought narrated through
  ElevenLabs in a warm baritone.
- **Cap twice.** `max_tokens` ≈ 220 at the model AND a character truncation
  (~500) after extraction — the second cap is what saves you when the first
  lies.
- **Timeout every leg** (LLM call, TTS call, playback) and run the whole thing
  async. A voice layer never blocks and never fails the host turn: log and go
  silent, don't throw.
- **Kill switch is a file** (`touch …/voice.off`), not a setting behind a UI.
- **Latency budget: first audio under ~8s.** Fast TTS tier for summaries
  (`eleven_flash_v2_5`-class); premium voices are for produced content, not
  turn chatter.

## Input — recognition

- **Grammar over dictation.** Word-boundary regexes against a small command
  set; echo what was heard into the status live region so misses are visible.
- **Playback-scoped grammar.** While TTS is speaking, honor ONLY the transport
  family — stop/mute/quiet/cancel · pause/hold on · resume/continue — and
  ignore everything else. The synthesized voice can pronounce your own nav
  keywords; without the scope, a brief that says "board" navigates mid-read.
- **Keep the ear hot while speaking.** Engines end after one result; re-arm in
  `onend` while playback is live so "stop" always lands, and null the
  recognizer ref when it winds down or the next arm silently no-ops.
- **A command with no target takes the obvious default.** "Brief me" with
  nothing open opens the first item and starts; voice users want motion, not a
  form error telling them to click something first.
- **Accept synonyms.** stop = mute = quiet = cancel; pause = hold on;
  resume = continue = keep going.

## UI sync — the contract

One control, three states, words at every step:

```
idle       mic icon        aria-label "Voice commands"    aria-pressed false
listening  mic, live fill  status: "Listening…"           aria-pressed true
speaking   STOP square     aria-label "Stop reading"      aria-pressed true
```

- **The same button stops everything at every stage.** Never make a listener
  hunt for a second control while the thing is talking at them.
- State is carried by icon shape + label + a `role="status"` region — never by
  color alone.
- **Route change cancels speech and clears the speaking state**, or the stop
  button orphans on a page that isn't reading.
- No Web Speech support → render nothing. A disabled mic is furniture.
- First audio follows a user gesture. Never speak on page load.
- **Teach the control with motion, not a scene.** A page that explains a
  voice feature shows the CONTROL cycling its states — a tight looping strip
  of idle → listening → reading captured from the running app — beside three
  numbered steps. A full-app screenshot "showing voice" teaches nothing;
  reviewers said so in exactly those words (2026-08-05).

## Test harness traps

- Plain assignment to `window.speechSynthesis` silently loses to the native
  object — mock with `Object.defineProperty` (and mock the Utterance class too,
  or native `speak()` type-rejects yours).
- Host "voice modes" may be input-only — Claude Code ships zero TTS; the
  robotic readback people complain about is the OS spoken-content layer. Build
  the speaker, then have the user turn the OS one off, or they duet.
- Playback time counts against hook/harness timeouts — bound the utterance
  length, not the player.
