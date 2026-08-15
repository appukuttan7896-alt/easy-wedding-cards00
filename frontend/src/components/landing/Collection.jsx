import { COLLECTION, IMAGES } from "../../data/landing";
import { Reveal } from "./motion";

const Product = ({ item, aspect, index }) => (
  <a
    href="/shop"
    data-testid={`product-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
    className="group block"
  >
    <div className={`relative overflow-hidden ${aspect}`}>
      <img
        src={item.img}
        alt={`${item.name} — ${item.detail} wedding invitation`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />
    </div>
    <div className="mt-5 flex items-baseline justify-between">
      <div className="transition-transform duration-500 ease-out group-hover:translate-x-1">
        <h3 className="font-serif text-2xl md:text-3xl text-espresso leading-none">
          {item.name}
        </h3>
        <p className="mt-2 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-taupe">
          {item.detail}
        </p>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-espresso opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0">
        View Invitation
        <span>&rarr;</span>
      </span>
    </div>
  </a>
);

export const Collection = () => {
  return (
    <section
      id="collection"
      data-testid="collection-section"
      className="relative bg-ivory pb-28 md:pb-36"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="max-w-4xl">
          <Reveal as="p" className="font-sans text-[0.68rem] uppercase tracking-[0.34em] text-taupe mb-7">
            The Collection
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="font-serif text-espresso leading-[0.95] tracking-tight text-4xl sm:text-6xl lg:text-7xl"
          >
            Find the one <span className="italic">that feels</span> like you.
          </Reveal>
          <Reveal
            as="p"
            delay={0.12}
            className="mt-8 font-sans font-light text-base md:text-lg text-taupe max-w-xl leading-relaxed"
          >
            Invitations for celebrations that are intimate, grand, timeless, modern — and
            entirely yours.
          </Reveal>
        </div>

        {/* Editorial spread */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-x-6 lg:gap-x-8 gap-y-16 md:gap-y-24 items-start">
          <Reveal className="md:col-span-5">
            <Product item={COLLECTION[0]} aspect="aspect-[3/4]" index={0} />
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-4 md:mt-24">
            <Product item={COLLECTION[1]} aspect="aspect-[4/5]" index={1} />
          </Reveal>

          {/* Detail photograph */}
          <Reveal delay={0.12} className="md:col-span-3 md:mt-52">
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src={IMAGES.detailEmboss}
                alt="Macro close-up of blind embossed lettering on ivory cotton paper"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-5 font-serif italic text-lg text-taupe">
              The detail is the difference.
            </p>
          </Reveal>

          {/* Wide composition */}
          <Reveal className="md:col-span-7">
            <Product item={COLLECTION[3]} aspect="aspect-[16/11]" index={3} />
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-5 md:mt-16">
            <Product item={COLLECTION[2]} aspect="aspect-[4/5]" index={2} />
          </Reveal>

          <Reveal className="md:col-span-4">
            <Product item={COLLECTION[4]} aspect="aspect-square" index={4} />
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-5 md:col-start-6 md:mt-8">
            <Product item={COLLECTION[5]} aspect="aspect-[3/4]" index={5} />
          </Reveal>
        </div>

        {/* Collection CTA */}
        <Reveal className="mt-24 md:mt-32 flex justify-center">
          <a
            href="/shop"
            data-testid="explore-cards-cta"
            className="group arrow-parent inline-flex items-center gap-4 font-serif text-espresso text-3xl sm:text-4xl lg:text-5xl leading-none"
          >
            <span className="border-b border-espresso/40 pb-2 transition-colors duration-500 group-hover:border-espresso">
              Explore All Wedding Cards
            </span>
            <span className="arrow-move text-2xl sm:text-3xl">&rarr;</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};
