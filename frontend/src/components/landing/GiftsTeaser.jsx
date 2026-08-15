import { IMAGES } from "../../data/landing";
import { Reveal } from "./motion";

export const GiftsTeaser = () => {
  return (
    <section data-testid="gifts-section" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7 order-1">
            <div className="relative overflow-hidden aspect-[16/10] group">
              <img
                src={IMAGES.gifts}
                alt="An elegantly wrapped wedding gift in ivory and champagne paper with silk ribbon"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-5 order-2">
            <Reveal as="p" className="font-sans text-[0.68rem] uppercase tracking-[0.34em] text-taupe mb-7">
              For the Guests
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="font-serif text-espresso leading-[0.98] tracking-tight text-4xl md:text-5xl lg:text-6xl"
            >
              For those <span className="italic">celebrating</span> with them.
            </Reveal>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-7 font-sans font-light text-base md:text-lg text-taupe max-w-md leading-relaxed"
            >
              Thoughtful wedding gifts for the people beginning their next chapter together —
              chosen by the guests, for the couple.
            </Reveal>
            <Reveal delay={0.15} className="mt-10">
              <a
                href="/gifts"
                data-testid="explore-gifts-cta"
                className="group arrow-parent inline-flex items-center gap-2 font-sans text-[0.72rem] uppercase tracking-[0.24em] text-espresso"
              >
                <span className="link-underline">Explore Gifts</span>
                <span className="arrow-move">&rarr;</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
