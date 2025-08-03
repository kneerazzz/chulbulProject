
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import CtaSection from "@/components/CtaSection";
import React from "react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <ProductPreview />
      <CtaSection />
    </div>
  );
}
