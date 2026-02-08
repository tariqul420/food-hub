export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminUserColumns } from "@/components/dashboard/table-columns";
import api from "@/lib/fetcher";
import { AdminUserRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};

  const res = await api.get<DataResponse<{ users?: AdminUserRecord[] }>>(
    "/v1/users/admin",
    {
      limit: Number(pageSize || 25),
      page: Number(pageIndex || 1),
      search: search?.trim(),
    },
  );

  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={res.data?.pagination?.totalItems || 0}
        data={(res.data?.users as AdminUserRecord[]) || []}
        columns={adminUserColumns || []}
      />
    </>
  );
}
