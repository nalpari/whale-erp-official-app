import StoreEditPhoto from "@/components/storeinfo/storeedit/StoreEditPhoto";

export default async function StoreEditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreEditPhoto id={Number(id)} />;
}
