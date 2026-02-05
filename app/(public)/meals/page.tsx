import MealCard from "@/components/cards/MealCard";
import SearchBar from "@/components/global/url/search-bar";
import SortSelect from "@/components/global/url/sort-select";
import api from "@/lib/fetcher";
import { clearQuery, setQuery, withPageReset } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

interface MealItem {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  price?: number | string;
  providerProfileId?: string;
  provider?: { id: string; name: string } | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug?: string | null;
}

function qsFromSearchParams(sp: Record<string, unknown>): string {
  const s = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) {
      if (v[0] != null && v[0] !== "") s.set(k, String(v[0]));
    } else if (v !== "") {
      s.set(k, String(v));
    }
  });
  return s.toString();
}

function makeAllHref(currentQS: string): string {
  const qs = clearQuery(currentQS, ["category"]);
  return qs ? `/meals?${qs}` : "/meals";
}

export function makeCategoryHref(
  currentQS: string,
  categoryValue: string,
  resetPage = true,
): string {
  const nextQS = resetPage
    ? setQuery(currentQS, withPageReset({ category: categoryValue }))
    : setQuery(currentQS, { category: categoryValue });
  return nextQS ? `/meals?${nextQS}` : "/meals";
}

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { search, sort, page, category } = await searchParams;

  const currentQS = qsFromSearchParams({ search, page, sort, category });

  const [meals, categories] = await Promise.all([
    api.get<{ data?: MealItem[] }>("/meals", {
      search,
      sort,
      page,
    }),
    api.get<{ data?: { id: string; name: string }[] }>("/categories"),
  ]);

  const hasCategories =
    Array.isArray(categories.data) && categories.data.length > 0;
  const isAllActive = !categories.data || !hasCategories;

  const baseLink = "block rounded-md px-3 py-2 text-sm font-medium transition";
  const activeLink = "bg-accent text-accent-foreground";
  const idleLink =
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <section className="py-10">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <aside className="hidden w-full col-span-3 lg:block">
            <h2 className="mb-4 text-lg font-semibold tracking-wide uppercase">
              Product Categories
            </h2>

            {hasCategories ? (
              <ul className="space-y-2">
                <li>
                  <Link
                    href={makeAllHref(currentQS)}
                    aria-current={isAllActive ? "page" : undefined}
                    className={`${baseLink} ${isAllActive ? activeLink : idleLink}`}
                  >
                    All Categories
                  </Link>
                </li>

                {(categories.data || []).map((c: CategoryItem) => {
                  const catValue = c.slug ?? c.id;
                  const isActive = category === catValue;
                  return (
                    <li key={c.id}>
                      <Link
                        href={makeCategoryHref(currentQS, catValue)}
                        aria-current={isActive ? "page" : undefined}
                        className={`${baseLink} ${isActive ? activeLink : idleLink}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                <TriangleAlertIcon size={16} className="mr-2 inline-block" />
                No categories available at the moment.
                <br />
                Please check back later.
              </div>
            )}
          </aside>

          <main className="col-span-12 lg:col-span-9">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 md:mr-4">
                <SearchBar placeholder="Search meals..." />
              </div>

              <div className="w-full md:w-48">
                <SortSelect
                  items={[
                    { value: "", label: "Default" },
                    { value: "price_asc", label: "Price: Low → High" },
                    { value: "price_desc", label: "Price: High → Low" },
                    { value: "newest", label: "Newest" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {Array.isArray(meals.data) && meals.data.length ? (
                meals.data.map((meal: MealItem) => (
                  <MealCard
                    key={meal.id}
                    id={meal.id}
                    title={meal.title}
                    image={meal.image ?? undefined}
                    price={meal.price}
                    description={meal.description ?? undefined}
                    providerName={meal.provider?.name}
                    providerProfileId={meal.providerProfileId}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground col-span-full">
                  <TriangleAlertIcon size={28} className="mb-3 opacity-70" />
                  <div className="text-lg font-medium">No meals found.</div>
                  <div className="text-sm">
                    Try adjusting your search, category, or filters.
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
