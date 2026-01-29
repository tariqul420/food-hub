import Categories from "@/components/home/Categories";
import Deals from "@/components/home/Deals";
import FAQ from "@/components/home/FAQ";
import Featured from "@/components/home/Featured";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import MobileBar from "@/components/home/MobileBar";
import Nav from "@/components/home/Nav";
import Providers from "@/components/home/Providers";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 0;

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto w-[95vw] max-w-7xl space-y-12 py-8">
        <Hero />
        <Categories />
        <Featured />
        <HowItWorks />
        <Deals />
        <Providers />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
      <MobileBar />
    </div>
  );
}
