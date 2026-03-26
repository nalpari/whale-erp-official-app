"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContractDetail } from "@/hooks/queries/use-contract-queries";
import ContractEditTime from "@/components/contract/ContractEditTime";

export default function ContractEditTimePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  useEffect(() => {
    if (isNaN(id)) {
      router.replace("/contract");
    }
  }, [id, router]);

  const { data } = useContractDetail(isNaN(id) ? undefined : id);

  if (isNaN(id)) return null;

  return <ContractEditTime key={id} initialData={data} />;
}
