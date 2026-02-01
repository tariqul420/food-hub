"use client";

import { createSelectionColumn } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { AdminUserRecord } from "@/types/table-columns";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

// user columns for admin
export const adminUserColumns: ColumnDef<AdminUserRecord>[] = [
  createSelectionColumn<AdminUserRecord>(),
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <h3 className="max-w-36 truncate text-sm font-medium">
        {row.original.email}
      </h3>
    ),
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">{row.original.role}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
];
