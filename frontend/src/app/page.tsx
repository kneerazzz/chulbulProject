
import { HeroSection, FeaturesSection, ProductPreview, CtaSection } from "./components/home"
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
