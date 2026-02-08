export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { providerMealColumns } from "@/components/dashboard/table-columns";
import { getUser } from "@/lib/auth/guard";
import api from "@/lib/fetcher";
import { ProviderMealRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};
  const user = await getUser();

  const res = await api.get<DataResponse<{ meals?: ProviderMealRecord[] }>>(
    `/v1/meals/provider/${user?.id}`,
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
        data={(res.data?.meals as ProviderMealRecord[]) || []}
        columns={providerMealColumns || []}
        actionLink={{
          label: "Add Menu",
          href: "/dashboard/provider/menu/add",
        }}
      />
    </>
  );
}
