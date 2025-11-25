"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SortByOptions = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Price: Low to High", value: "Asc" },
  { name: "Price: High to Low", value: "desc" },
];

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 my-6">
      <span>Sort by:</span>
      <select
        name="sort"
        id="sort"
        className="ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
        onChange={(e) => handleFilter(e.target.value)}
      >
        {SortByOptions.map(({ name, value }) => (
          <option value={value} key={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
