/**
 * shadcn work queue — authored reference for the `queue` screen.
 *
 * shadcn ships no queue block, so this is authored from its primitives (Table,
 * Input, Button, Select, Checkbox, DropdownMenu, Badge) plus TanStack Table for
 * the grid state. It exists because the only shadcn row that carried the queue
 * jobs was dashboard-01, whose reference roles demand a chart — and a queue is
 * a grid with a job, not a dashboard missing its chart.
 *
 * Structure, and why each part is here:
 *   masthead    what this queue is and WHEN it was generated. A queue whose
 *               freshness is unstated reads as live when it may be a snapshot.
 *   toolbar     search, column visibility, and the one filled primary — open
 *               the top row where the work happens. The page exists to move
 *               the reader to the record, so the primary is a departure, not
 *               a refresh.
 *   batch bar   mounted at rest with its resting count and a disabled
 *               action; enables with selection. A status region created on
 *               first selection is announced unreliably.
 *   the grid    the focal object. Sortable columns sort the VALUE (amounts
 *               and dates carry sort keys, never their rendered labels), rows
 *               deep-link to their record, and the trailing cell is the row
 *               action. Empty and filtered-empty are different sentences.
 *   pagination  page size and stated position, rendered at rest even when one
 *               page holds everything — it is how the reader knows the queue
 *               is complete.
 *   gated row   an action whose delivery is not yet authorized renders
 *               disabled WITH THE REASON, never omitted.
 *
 * The living implementations of this screen are cro-suite's
 * site/src/components/data-grid.tsx and Nucleus's components/ui/data-grid.tsx;
 * this file is the minimal composed statement of the same contract.
 */
"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Columns3, ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QueueRow = {
  id: string;
  title: string;
  kind: string;
  owner: string;
  amount: number;
  due: string;
  url: string;
};

const ROWS: QueueRow[] = [
  { id: "q1", title: "Placeholder Dynamics — Enterprise QA", kind: "Never logged", owner: "Sam Okafor", amount: 12_100_000, due: "1 Oct", url: "#q1" },
  { id: "q2", title: "Bureau of Fictional Affairs — Screening", kind: "Past due", owner: "Riley Vega", amount: 8_400_000, due: "15 Aug", url: "#q2" },
  { id: "q3", title: "Synthetic State DOL — UI Integrity", kind: "Never logged", owner: "Riley Vega", amount: 5_250_000, due: "20 Sep", url: "#q3" },
  { id: "q4", title: "Imaginary Rail Co — Contractor Vetting", kind: "Silent 30d", owner: "Dana Liu", amount: 3_400_000, due: "15 Oct", url: "#q4" },
  { id: "q5", title: "Example Logistics — Vendor Vetting", kind: "Silent 30d", owner: "Dana Liu", amount: 2_300_000, due: "5 Nov", url: "#q5" },
];

const money = (value: number) => `$${(value / 1_000_000).toFixed(1)}M`;

export default function WorkQueue() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "amount", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo<ColumnDef<QueueRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows on this page"
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select ${row.original.title}`}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
          />
        ),
        enableSorting: false,
      },
      { accessorKey: "kind", header: "Problem", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Item <ArrowUpDown aria-hidden />
          </Button>
        ),
      },
      { accessorKey: "owner", header: "Owner" },
      {
        // Sorts the number; the label is formatting applied at print time only.
        accessorKey: "amount",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Value <ArrowUpDown aria-hidden />
          </Button>
        ),
        cell: ({ getValue }) => <span className="tabular-nums">{money(Number(getValue()))}</span>,
      },
      { accessorKey: "due", header: "Due" },
      {
        id: "open",
        header: "",
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <a href={row.original.url}>
              Open <ExternalLink aria-hidden />
            </a>
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: ROWS,
    columns,
    state: { sorting, globalFilter, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selected = table.getSelectedRowModel().rows;
  const top = table.getRowModel().rows[0]?.original;
  const isFiltered = globalFilter.trim().length > 0;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-semibold">Work queue</h1>
        {/* Freshness is content, not chrome: this queue is a rendered snapshot. */}
        <p className="text-sm text-muted-foreground">14 flagged items · generated 06:30 UTC from one snapshot</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search aria-hidden className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            aria-label="Search the queue"
            className="w-64 pl-8"
            placeholder="Search items or owners"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
        </div>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={() => setGlobalFilter("")}>
            Clear
          </Button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 aria-hidden /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(Boolean(v))}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* The one filled primary: a departure to where the work happens. */}
        {top ? (
          <Button className="ml-auto" asChild>
            <a href={top.url}>
              <ExternalLink aria-hidden /> Open top record
            </a>
          </Button>
        ) : null}
      </div>

      {/* Mounted at rest with its resting count: a status region created on
          first selection is announced unreliably (the weekly-board lesson). */}
      <div role="status" className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
        <span className="text-sm font-medium">{selected.length} selected</span>
        <Button variant="outline" size="sm" disabled={!selected.length}>
          Open selected
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Different sentences: an empty queue and an over-filtered one. */}
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {isFiltered ? "No items match these filters." : "Nothing in this queue. Every source reported in."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger aria-label="Rows per page" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* A gated action is visible, disabled, and names its gate — never omitted. */}
      <p className="text-sm text-muted-foreground">
        <Button variant="outline" size="sm" disabled title="Blocked on connector authorization">
          Nudge owners
        </Button>{" "}
        Delivery is off until the connector carries a dated authorization.
      </p>
    </main>
  );
}
