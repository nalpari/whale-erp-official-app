import { notFound } from "next/navigation";
import CommuteDetail from "@/components/commute/CommuteDetail";

export default async function CommuteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employeeId = /^[1-9]\d*$/.test(id) ? Number(id) : NaN;
  if (isNaN(employeeId)) notFound();
  return <CommuteDetail employeeId={employeeId} />;
}
