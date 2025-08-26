import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import GameFeatures from "@/components/GameFeatures";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <GameFeatures />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
