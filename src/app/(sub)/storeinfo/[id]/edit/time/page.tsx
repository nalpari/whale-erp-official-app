import StoreEditTime from "@/components/storeinfo/storeedit/StoreEditTime";

export default async function StoreEditTimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreEditTime id={Number(id)} />;
}
