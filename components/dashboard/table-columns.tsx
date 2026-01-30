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
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Published",
    header: "Published",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.isPublished ? "Published" : "Unpublished"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<AdminUserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
];
