import MainContents from "@/components/main/MainContents"
import AuthGuard from "@/components/auth/AuthGuard"

export default function Home() {
  return (
    <AuthGuard>
      <MainContents />
    </AuthGuard>
  )
}
