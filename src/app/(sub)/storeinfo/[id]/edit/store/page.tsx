import StoreEditInfo from "@/components/storeinfo/storeedit/StoreEditInfo";

export default async function StoreEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreEditInfo id={Number(id)} />;
}
