import ProductList from "@/components/ProductList";
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const category = (await searchParams).category;
  return (
    <div className="">
      <div className="relative aspect-3/1 mb-12">
        <Image src="/featured.png" alt="Feature" fill />
      </div>
      <ProductList category={category} params="homepage" />
    </div>
  );
}
