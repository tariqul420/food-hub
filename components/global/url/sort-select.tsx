"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export type SortOption = {
  value: string;
  label: string;
};

export interface SortSelectProps {
  items: SortOption[];
  paramKey?: string;
  placeholder?: string;
  defaultValue?: string;
  replace?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
}

export default function SortSelect({
  items,
  paramKey = "sort",
  placeholder = "Default sorting",
  defaultValue = "",

  replace = true,
  className = "w-full md:w-48",
  onValueChange,
  ariaLabel = "Sort options",
}: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = React.useState(() => {
    return searchParams?.get(paramKey) ?? defaultValue;
  });

  React.useEffect(() => {
    const urlVal = searchParams?.get(paramKey) ?? defaultValue;
    setValue((prev) => (prev !== urlVal ? urlVal : prev));
  }, [searchParams, paramKey, defaultValue]);

  const updateUrl = (v: string) => {
    if (!searchParams) return;

    const newUrl =
      v && v !== defaultValue
        ? formUrlQuery({
            params: searchParams.toString(),
            key: paramKey,
            value: v,
          })
        : formUrlQuery({
            params: searchParams.toString(),
            key: paramKey,
            value: null,
          });

    if (replace) {
      router.replace(newUrl, { scroll: false });
    } else {
      router.push(newUrl, { scroll: false });
    }

    onValueChange?.(v);
  };

  const handleChange = (v: string) => {
    setValue(v);
    updateUrl(v);
  };

  return (
    <div className="overflow-hidden rounded-md dark:bg-transparent">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={className} aria-label={ariaLabel}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items
            .filter((it) => it.value !== "")
            .map((it) => (
              <SelectItem key={it.value} value={it.value}>
                {it.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
