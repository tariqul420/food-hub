"use client";

import DataTable from "@/components/dashboard/data-table";
import { getProviderOrderColumns } from "@/components/dashboard/table-columns";
import { ProviderOrderRecord } from "@/types/table-columns";
import * as React from "react";

interface Props {
  data: ProviderOrderRecord[];
  pageIndex: number;
  pageSize: number;
  total: number;
  showEmail?: boolean;
}

export default function OrdersTableClient({
  data,
  pageIndex,
  pageSize,
  total,
  showEmail = false,
}: Props) {
  const columns = React.useMemo(
    () => getProviderOrderColumns(showEmail),
    [showEmail],
  );

  return (
    <DataTable
      pageIndex={Number(pageIndex || 1)}
      pageSize={Number(pageSize || 25)}
      total={total}
      data={data || []}
      columns={columns}
    />
  );
}
