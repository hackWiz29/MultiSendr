import HeroSection from "../components/HeroSection";
import Link from "next/link";
import Button from "../components/ui/Button";
import { IoArrowForward } from "react-icons/io5";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#2E2E2E]">
      <HeroSection />
    </main>
  );
}
