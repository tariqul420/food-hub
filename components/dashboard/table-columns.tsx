"use client";

import { createSelectionColumn } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import AdminCategoryTableMenu from "@/features/category/components/admin-category-table-menu";
import ProviderMealsTableMenu from "@/features/menu/components/provider-meals-table-menu";
import OrderTableMenu from "@/features/order/components/order-table-menu";
import {
  AdminCategoryRecord,
  AdminUserRecord,
  ProviderMealRecord,
  ProviderOrderRecord,
} from "@/types/table-columns";
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

// meal columns for provider
export const providerMealColumns: ColumnDef<ProviderMealRecord>[] = [
  createSelectionColumn<ProviderMealRecord>(),
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }: { row: Row<ProviderMealRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.title}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Price",
    header: "Price",
    cell: ({ row }: { row: Row<ProviderMealRecord> }) => (
      <h3 className="max-w-36 truncate text-sm font-medium">
        ${row.original.price} {row.original.currency}
      </h3>
    ),
  },
  {
    accessorKey: "Availability",
    header: "Availability",
    cell: ({ row }: { row: Row<ProviderMealRecord> }) => (
      <div className="w-32">
        <Badge variant={row.original.isAvailable ? "secondary" : "destructive"}>
          {row.original.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<ProviderMealRecord> }) => (
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
    cell: ({ row }: { row: Row<ProviderMealRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <ProviderMealsTableMenu row={row} />,
  },
];

// order columns for provider
export const providerOrderColumns: ColumnDef<ProviderOrderRecord>[] = [
  createSelectionColumn<ProviderOrderRecord>(),
  {
    accessorKey: "Customer Name",
    header: "Customer Name",
    cell: ({ row }: { row: Row<ProviderOrderRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.customer.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Total",
    header: "Total",
    cell: ({ row }: { row: Row<ProviderOrderRecord> }) => (
      <h3 className="max-w-36 truncate text-sm font-medium">
        ${row.original.total}
      </h3>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }: { row: Row<ProviderOrderRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">{row.original.status}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "Placed At",
    header: "Placed At",
    cell: ({ row }: { row: Row<ProviderOrderRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.placedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<ProviderOrderRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <OrderTableMenu row={row} />,
  },
];

// category columns for admin
export const adminCategoryColumns: ColumnDef<AdminCategoryRecord>[] = [
  createSelectionColumn<AdminCategoryRecord>(),
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }: { row: Row<AdminCategoryRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<AdminCategoryRecord> }) => (
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
    cell: ({ row }: { row: Row<AdminCategoryRecord> }) => (
      <div className="w-32">
        <Badge variant="outline">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminCategoryTableMenu row={row} />,
  },
];