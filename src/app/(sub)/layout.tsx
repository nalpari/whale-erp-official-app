import AuthGuard from "@/components/auth/AuthGuard"

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
