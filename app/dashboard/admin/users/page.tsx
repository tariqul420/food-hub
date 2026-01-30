export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminUserColumns } from "@/components/dashboard/table-columns";
import api from "@/lib/fetcher";
import { AdminUserRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};

  const { data } = await api.get("/admin/users", {
    limit: Number(pageSize || 25),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  console.log(data);

  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={data.pagination?.totalItems || 0}
        data={(data.users as AdminUserRecord[]) || []}
        columns={adminUserColumns || []}
        actionLink={{
          href: "/dashboard/admin/users/add",
          label: "Add User",
        }}
      />
    </>
  );
}
