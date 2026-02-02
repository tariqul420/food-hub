export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { providerOrderColumns } from "@/components/dashboard/table-columns";
import { getUser } from "@/lib/auth/guard";
import api from "@/lib/fetcher";
import { ProviderOrderRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};
  const user = await getUser();

  const res = await api.get<DataResponse<{ orders?: ProviderOrderRecord[] }>>(
    `/orders/provider/${user?.id}`,
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
        data={(res.data?.orders as ProviderOrderRecord[]) || []}
        columns={providerOrderColumns || []}
      />
    </>
  );
}
