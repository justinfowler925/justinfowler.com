# Choose each layer for its job

Run `node integrations/resolve.mjs --project <consumer>` before imports. The result separates
styling, components and data; a TanStack dependency does not prove shadcn is installed and a
shadcn configuration does not require a table engine. `components.json` is a configuration
signal, not proof that a particular component exists: inspect the resolved alias and source.

## Responsibilities

- **Tailwind:** page composition, grid/flex layout, spacing, typography, responsive behavior,
  hover/focus/disabled styling and token-backed visual variants. Reuse the installed version,
  build pipeline, prefix and theme. Utilities style behavior; they do not implement it.
- **shadcn:** reuse the installed Button, Dialog, Sheet, DropdownMenu, Popover, Tabs, Tooltip,
  Select and other controls where they supply the needed semantics and interaction. Preserve
  their existing Radix or Base UI implementation, focus management and keyboard behavior.
  Tailwind can customize their appearance. Do not replace a working dialog with styled divs.
- **TanStack Table:** table sorting, filtering, selection, visibility and pagination state.
  Reuse the product's shared DataGrid first. Plain forms, cards and marketing pages need no
  table dependency. The integration scaffold is a state adapter, not a finished DataGrid.
- **Consumer components:** product-specific cards, toolbars, grids and shells own conventions.
  Compose or extend these before copying catalog components. Existing chart, form and router
  libraries keep their jobs. Native HTML is sufficient when its semantics fit the interaction.
- **Salesforce:** use SLDS and Lightning components in the Lightning host. A Tailwind dependency
  elsewhere in the repository is not permission to inject Tailwind into Salesforce.

## Tailwind integration

For an existing product, inspect its CSS entrypoint and installed Tailwind package. For v4,
reuse its `@import "tailwindcss"` and CSS theme mappings; for v3, reuse its configuration,
content globs and `@tailwind` directives. Do not mix the two setup syntaxes or upgrade versions
as a styling side effect. Keep class names statically discoverable; use a finite class map for
variants rather than interpolated fragments. Preserve prefixes and dark-mode strategy.

The consumer's semantic tokens are authoritative. Map missing utilities to those tokens in
its existing theme: for example, use existing `bg-background`, `text-foreground`, `border-border`
and `bg-primary` utilities when configured. Inspect whether color variables contain complete
CSS colors or HSL channels before mapping them. Do not inject Shine's personal token palette,
reset a theme, or add a second global stylesheet with competing token definitions.

For a new React surface, use Tailwind for its layout and install only the shadcn controls the
workflow requires. If no stack is installed, select that stack explicitly and set it up using
the framework's supported integration, then rerun the resolver. A Tailwind-only consumer is
supported; no shadcn or TanStack installation is required to render semantic content.

`core/render-spec.mjs` is a standalone native HTML renderer. It does not render the consumer's
React components. For React/Tailwind/shadcn delivery, implement the packet directly inside the
consumer and run proof against that actual build; do not use the native preview as its proof.

## Verification

Resolve declared and installed dependencies before generation. The generated TanStack adapter
selects v8 or v9 from the installed package and checks its real exports; unsupported versions
fail with guidance to preserve the existing grid rather than upgrading it. Typecheck generated code in the consumer.
Exercise real controls, keyboard focus, narrow/wide layouts and dark mode where supported.
Run `node verify/tailwind-runtime.mjs --project <installed-v4-fixture>` for real CSS compilation,
responsive layout, consumer token/dark-mode and keyboard-focus proof. Keep downloads on Studio.
A compiled Tailwind stylesheet is styling evidence; component behavior still needs browser proof.

Official references: [Tailwind utilities](https://tailwindcss.com/docs/styling-with-utility-classes),
[v4 theme variables](https://tailwindcss.com/docs/theme),
[v3 configuration](https://v3.tailwindcss.com/docs/configuration),
[shadcn configuration](https://ui.shadcn.com/docs/components-json).
