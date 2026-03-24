import type { Metadata } from "next";
import "@/styles/style.scss";
import QueryProvider from "@/providers/query-provider";
import PopupControler from "@/components/ui/PopupControler";
import BottomSheetControler from "@/components/ui/BottomSheetControler";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import RnbMenu from "@/components/ui/RnbMenu";

export const metadata: Metadata = {
  title: "Whale ERP",
  description: "Whale ERP Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="wrap">
            <Header />
            <RnbMenu />
            {children}
            <Footer />
          </div>

          <PopupControler />
          <BottomSheetControler />
        </QueryProvider>
      </body>
    </html>
  );
}
