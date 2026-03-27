import StoreInfoDetail from "@/components/storeinfo/StoreInfoDetail";

export default async function StoreInfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreInfoDetail id={Number(id)} />;
}
