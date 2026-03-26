import { Suspense } from "react";
import TodoContents from "@/components/todo/TodoContents";

export default function TodoPage() {
  return (
    <Suspense>
      <TodoContents />
    </Suspense>
  );
}
