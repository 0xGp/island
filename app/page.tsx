import { SiteNavigation } from "@/components/navigation/SiteNavigation";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";
import { Storybook } from "@/components/sections/Storybook";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <a
        href="#reverse"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:bg-ivory focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-midnight"
      >
        Skip to official links
      </a>
      <SiteNavigation />
      <main id="top">
        <CinematicExperience />
        <Storybook />
      </main>
      <SiteFooter />
    </>
  );
}
