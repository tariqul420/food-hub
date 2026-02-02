export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminCategoryColumns } from "@/components/dashboard/table-columns";
import CategoryForm from "@/features/category/components/category-form";
import api from "@/lib/fetcher";
import { AdminCategoryRecord } from "@/types/table-columns";

export default async function Page({ searchParams }: DashboardSearchParams) {
  const { pageSize, pageIndex, search } = (await searchParams) || {};

  const res = await api.get<
    DataResponse<{ categories?: AdminCategoryRecord[] }>
  >("/categories/admin", {
    limit: Number(pageSize || 25),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={res.data?.pagination?.totalItems || 0}
        data={(res.data?.categories as AdminCategoryRecord[]) || []}
        columns={adminCategoryColumns || []}
        actionModal={{
          label: "Add Category",
          title: "Add Category",
          form: <CategoryForm />,
        }}
      />
    </>
  );
}
