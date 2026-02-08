export const dynamic = "force-dynamic";

import OrdersTableClient from "@/components/dashboard/orders-table-client";
import api from "@/lib/fetcher";
import { ProviderOrderRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};

  const res = await api.get<DataResponse<{ orders?: ProviderOrderRecord[] }>>(
    `/v1/orders/admin`,
    {
      limit: Number(pageSize || 25),
      page: Number(pageIndex || 1),
      search: search?.trim(),
    },
  );

  return (
    <>
      <OrdersTableClient
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={res.data?.pagination?.totalItems || 0}
        data={(res.data?.orders as ProviderOrderRecord[]) || []}
        showEmail={true}
      />
    </>
  );
}
