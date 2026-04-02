import { Suspense } from "react";
import TodoContents from "@/components/todo/TodoContents";

export default function TodoPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>로딩 중...</div>}>
      <TodoContents />
    </Suspense>
  );
}
