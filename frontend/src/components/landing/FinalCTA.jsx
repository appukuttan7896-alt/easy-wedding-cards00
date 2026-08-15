import { IMAGES } from "../../data/landing";
import { Reveal } from "./motion";

export const FinalCTA = () => {
  return (
    <section data-testid="final-cta-section" className="bg-espresso text-cream py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Reveal as="p" className="font-sans text-[0.68rem] uppercase tracking-[0.34em] text-roseSoft mb-9">
              The Beginning
            </Reveal>

            <Reveal
              as="h2"
              delay={0.05}
              className="font-serif leading-[0.98] tracking-tight text-4xl md:text-5xl lg:text-6xl text-cream/95"
            >
              There are hundreds of details in a wedding.
            </Reveal>

            <Reveal
              as="h3"
              delay={0.12}
              className="mt-12 md:mt-16 font-serif italic leading-[0.98] tracking-tight text-5xl md:text-6xl lg:text-7xl text-cream"
            >
              This is the first
              <br />
              one they hold.
            </Reveal>

            <Reveal
              as="p"
              delay={0.18}
              className="mt-10 font-sans font-light text-base md:text-lg text-cream/70 max-w-md leading-relaxed"
            >
              Make the first impression worth remembering.
            </Reveal>

            <Reveal delay={0.24} className="mt-11">
              <a
                href="/shop"
                data-testid="final-shop-cta"
                className="group arrow-parent inline-flex items-center gap-3 border border-cream/50 px-8 py-4 font-sans text-[0.72rem] uppercase tracking-[0.24em] text-cream transition-colors duration-500 hover:bg-cream hover:text-espresso"
              >
                Find Your Invitation
                <span className="arrow-move">&rarr;</span>
              </a>
            </Reveal>
          </div>

          {/* Photograph */}
          <Reveal delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[5/6]">
              <img
                src={IMAGES.finalHeld}
                alt="Hands gently holding an ivory wedding invitation over a softly styled table"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
