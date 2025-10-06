import { HeroSection } from "@/components/hero-section";
import { FeaturedTournaments } from "@/components/featured-tournaments";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedTournaments />
    </div>
  );
}
