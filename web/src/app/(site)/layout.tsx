import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Motion from "@/components/Motion";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Motion />
    </>
  );
}
