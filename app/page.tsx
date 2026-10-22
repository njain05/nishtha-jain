import { Overlay } from "@/components/vinyl/Overlay";
import { StageLoader } from "@/components/vinyl/StageLoader";

export default function Page() {
  return (
    <main className="relative h-[100svh] overflow-hidden bg-void">
      <h1 className="sr-only">
        Nishtha Jain — final-year computer science student at GNDEC, Ludhiana, who builds
        production web platforms and AI tools for real people.
      </h1>
      <div className="absolute inset-0">
        <StageLoader />
      </div>
      <Overlay />
    </main>
  );
}
