import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { Reveal } from "../components/landing/motion";

// Placeholder — replace with your real gift store URL
const GIFT_STORE_URL = "https://easyweddingcards.com/gifts";

const IMG = {
  hero: "https://images.unsplash.com/photo-1646181873070-409355786f7c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&fit=crop&auto=format",
  aspiration:
    "https://images.unsplash.com/photo-1677761640321-b80251be00ca?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400&fit=crop&auto=format",
};

const PAINS = [
  { n: "01", title: "The endless scroll.", body: "Hours lost to tabs and registries — and still nothing that feels quite right." },
  { n: "02", title: "The safe default.", body: "Another appliance, another gift card. Thoughtful in theory, forgotten by the weekend." },
  { n: "03", title: "The fear of getting it wrong.", body: "You want it to mean something. So did we — which is exactly why we started." },
];

const EDITS = [
  {
    name: "The Ritual",
    line: "A hand-poured candle for their first evening at home.",
    img: "https://images.unsplash.com/photo-1528351655744-27cc30462816?crop=entropy&cs=srgb&fm=jpg&q=85&w=900&fit=crop&auto=format",
    span: "md:col-span-5",
    aspect: "aspect-[3/4]",
  },
  {
    name: "The Vessel",
    line: "A ceramic vase, made to hold years of flowers.",
    img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=900&fit=crop&auto=format",
    span: "md:col-span-4 md:mt-20",
    aspect: "aspect-[4/5]",
  },
  {
    name: "The Gathering",
    line: "Quiet pieces for the table where their story unfolds.",
    img: "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?crop=entropy&cs=srgb&fm=jpg&q=85&w=900&fit=crop&auto=format",
    span: "md:col-span-3 md:mt-44",
    aspect: "aspect-[3/4]",
  },
  {
    name: "The Keepsake",
    line: "Small, quiet objects meant to be kept for good.",
    img: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1100&fit=crop&auto=format",
    span: "md:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    name: "The Evening",
    line: "Warm light for the slow, unhurried nights ahead.",
    img: "https://images.unsplash.com/photo-1640095889747-2090ee12fa7d?crop=entropy&cs=srgb&fm=jpg&q=85&w=900&fit=crop&auto=format",
    span: "md:col-span-5 md:mt-16",
    aspect: "aspect-[4/5]",
  },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Gifts() {
  return (
    <div className="App bg-ivory min-h-screen" data-testid="gifts-page">
      <Header />

      <main>
        {/* Hero — open on the pain */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <nav className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe mb-10">
              <Link to="/" data-testid="breadcrumb-home" className="link-underline hover:text-espresso transition-colors">
                Home
              </Link>
              <span className="mx-2 text-taupe/50">—</span>
              <span className="text-espresso">Gifts</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <Reveal as="p" className="font-sans text-[0.66rem] uppercase tracking-[0.34em] text-rose mb-6">
                  For the guests
                </Reveal>
                <Reveal
                  as="h1"
                  delay={0.05}
                  className="font-serif text-espresso leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-[4.2rem]"
                >
                  Finding the right wedding gift is <span className="italic">harder</span> than it should be.
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.12}
                  className="mt-8 font-sans font-light text-base md:text-lg text-taupe max-w-md leading-relaxed"
                >
                  You want to give something they'll remember — not another item ticked off a list. Something that
                  feels like the day itself.
                </Reveal>
                <Reveal delay={0.18} className="mt-10">
                  <a
                    href={GIFT_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="gifts-hero-cta"
                    className="group arrow-parent inline-flex items-center gap-3 border border-espresso px-8 py-4 font-sans text-[0.72rem] uppercase tracking-[0.24em] text-espresso transition-colors duration-500 hover:bg-espresso hover:text-cream"
                  >
                    Visit the store
                    <span className="arrow-move">&rarr;</span>
                  </a>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
                <div className="relative overflow-hidden aspect-[4/5] lg:aspect-square">
                  <img
                    src={IMG.hero}
                    alt="A wedding gift wrapped in soft paper and blush ribbon"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* The pain, in three chapters */}
        <section className="bg-cream py-20 md:py-28" data-testid="gifts-pain">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <Reveal as="p" className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-taupe mb-12">
              Why gifting feels impossible
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
              {PAINS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.08} className="border-t border-espresso/15 pt-6">
                  <span className="font-serif italic text-4xl text-rose">{p.n}</span>
                  <h3 className="mt-4 font-serif text-2xl md:text-3xl text-espresso leading-tight">{p.title}</h3>
                  <p className="mt-3 font-sans font-light text-sm text-taupe leading-relaxed">{p.body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-16 md:mt-20 font-serif italic text-espresso text-3xl md:text-5xl leading-tight max-w-3xl"
            >
              So we made the hard part simple.
            </Reveal>
          </div>
        </section>

        {/* Aspiration */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <Reveal className="lg:col-span-7 order-1">
                <div className="relative overflow-hidden aspect-[16/11]">
                  <img
                    src={IMG.aspiration}
                    alt="Two handmade ceramic vessels in warm daylight"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
              <div className="lg:col-span-5 order-2">
                <Reveal as="p" className="font-sans text-[0.66rem] uppercase tracking-[0.3em] text-rose mb-6">
                  The idea
                </Reveal>
                <Reveal
                  as="h2"
                  delay={0.05}
                  className="font-serif text-espresso leading-[0.98] tracking-tight text-4xl md:text-5xl lg:text-6xl"
                >
                  A gift they'll <span className="italic">keep</span>, not return.
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.12}
                  className="mt-7 font-sans font-light text-base md:text-lg text-taupe max-w-md leading-relaxed"
                >
                  The invitation was the first thing they held. The right gift is the thing they live with — a candle
                  lit on quiet nights, a vase filled again and again, a small object that carries the memory of your
                  presence long after the day.
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase — a glimpse, not a catalogue */}
        <section className="pb-8" data-testid="gifts-showcase">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl mb-14 md:mb-20">
              <Reveal as="p" className="font-sans text-[0.66rem] uppercase tracking-[0.3em] text-rose mb-6">
                A few of our favourites
              </Reveal>
              <Reveal
                as="h2"
                delay={0.05}
                className="font-serif text-espresso leading-[0.95] tracking-tight text-4xl sm:text-6xl lg:text-7xl"
              >
                Gifts worth <span className="italic">unwrapping.</span>
              </Reveal>
              <Reveal as="p" delay={0.12} className="mt-6 font-sans font-light text-base text-taupe max-w-xl leading-relaxed">
                A small, curated glimpse — chosen for how they feel, not how they photograph. The full collection lives
                in our store.
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 lg:gap-x-8 gap-y-14 md:gap-y-20 items-start">
              {EDITS.map((e, i) => (
                <Reveal key={e.name} delay={(i % 3) * 0.06} className={e.span} data-testid={`gift-edit-${slug(e.name)}`}>
                  <div className={`relative overflow-hidden bg-cream ${e.aspect} group`}>
                    <img
                      src={e.img}
                      alt={e.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl md:text-3xl text-espresso leading-none">{e.name}</h3>
                  <p className="mt-2 font-sans font-light text-sm text-taupe max-w-xs leading-relaxed">{e.line}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA — go to the store */}
        <section className="mt-20 md:mt-28 bg-espresso text-cream py-24 md:py-36" data-testid="gifts-store-band">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 text-center">
            <Reveal as="p" className="font-sans text-[0.66rem] uppercase tracking-[0.34em] text-roseSoft mb-8">
              This is only a glimpse
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="font-serif leading-[0.98] tracking-tight text-4xl md:text-6xl lg:text-7xl text-cream max-w-4xl mx-auto"
            >
              There's so much more <span className="italic">in the store.</span>
            </Reveal>
            <Reveal
              as="p"
              delay={0.12}
              className="mt-8 font-sans font-light text-base md:text-lg text-cream/70 max-w-xl mx-auto leading-relaxed"
            >
              Thoughtfully chosen wedding gifts for every couple and every budget — ready to send, beautifully wrapped.
            </Reveal>
            <Reveal delay={0.18} className="mt-11">
              <a
                href={GIFT_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="gifts-store-cta"
                className="group arrow-parent inline-flex items-center gap-3 border border-cream/50 px-10 py-5 font-sans text-[0.72rem] uppercase tracking-[0.24em] text-cream transition-colors duration-500 hover:bg-cream hover:text-espresso"
              >
                Visit our gift store
                <ArrowUpRight size={16} strokeWidth={1.5} className="arrow-move" />
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
