import { notFound } from "next/navigation";
import CommuteDetail from "@/components/commute/CommuteDetail";

export default function CommuteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const employeeId = /^[1-9]\d*$/.test(params.id) ? Number(params.id) : NaN;
  if (isNaN(employeeId)) notFound();
  return <CommuteDetail employeeId={employeeId} />;
}
