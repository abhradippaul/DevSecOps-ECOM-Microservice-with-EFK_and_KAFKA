import ProductList from "@/components/ProductList";

async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const category = (await searchParams).category;
  return (
    <div>
      <ProductList category={category} params="products" />
    </div>
  );
}

export default ProductPage;
