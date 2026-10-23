import { Outro } from "@/components/album/AfterTracks";
import { Sides } from "@/components/Sides";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Overlay } from "@/components/vinyl/Overlay";
import { StageLoader } from "@/components/vinyl/StageLoader";

/**
 * The record, top to bottom in a single scroll: the turntable, then
 * whichever side is facing up. Turn it over and the page below changes.
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main className="bg-void">
        <h1 className="sr-only">
          Nishtha Jain — Software &amp; Applied AI Engineer, final-year computer science at
          GNDEC Ludhiana, incoming AI Native Software Engineer Intern at EPAM India.
        </h1>
        <section
          id="top"
          aria-label="The turntable"
          className="relative h-[100svh] overflow-hidden"
        >
          <div className="absolute inset-0">
            <StageLoader />
          </div>
          <Overlay />
        </section>
        <Sides />
      </main>
      <Outro />
    </>
  );
}
