type Children = {
  children: React.ReactNode;
};

type DashboardSearchParams = {
  searchParams?: {
    pageSize?: string;
    pageIndex?: string;
    search?: string;
  };
};

type DataResponse<T> = {
  success: boolean;
  message?: string;
  data?: {
    [K in keyof T]: T[K];
  } & {
    pagination?: Pagination;
  };
};

type Pagination = {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
};

