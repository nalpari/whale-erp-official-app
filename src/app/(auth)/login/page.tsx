import { Suspense } from "react"
import Login from "@/components/login/Login"

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  )
}
