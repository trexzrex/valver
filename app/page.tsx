import { HeroSection } from "@/components/HeroSection";
import { InfoSection } from "@/components/InfoSection";
import { SessionCleanup } from "@/components/SessionCleanup";

export default function Home() {
  return (
    <>
      <SessionCleanup />
      <HeroSection />
      <InfoSection />
    </>
  );
}