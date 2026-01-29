import Categories from "@/components/home/Categories";
import Deals from "@/components/home/Deals";
import FAQ from "@/components/home/FAQ";
import Featured from "@/components/home/Featured";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Providers from "@/components/home/Providers";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 0;

export default function Page() {
  return (
    <div className="space-y-20">
      <Hero />
      <Categories />
      <Featured />
      <HowItWorks />
      <Deals />
      <Providers />
      <Testimonials />
      <FAQ />
    </div>
  );
}
