import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ArrowUpRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { ProductTile } from "../components/shop/ProductTile";
import { GalleryLightbox } from "../components/shop/GalleryLightbox";
import {
  cards,
  getCardBySlug,
  slugify,
  isPair,
  unit,
  money,
  useFavorites,
  getRecentlyViewed,
  addRecentlyViewed,
  WHATSAPP_NUMBER,
} from "../lib/shop";

export default function ProductDetail() {
  const { slug } = useParams();
  const card = useMemo(() => getCardBySlug(slug), [slug]);

  const { favorites, toggle } = useFavorites();
  const [variantIdx, setVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [recent, setRecent] = useState([]);

  // On navigating to a product: scroll top, reset, capture prior recents, then record this view.
  useEffect(() => {
    window.scrollTo(0, 0);
    setVariantIdx(0);
    setImageIdx(0);
    setGalleryOpen(false);
    if (!card) return;
    setRecent(
      getRecentlyViewed()
        .filter((id) => id !== card.id)
        .map((id) => cards.find((c) => c.id === id))
        .filter(Boolean)
        .slice(0, 6),
    );
    addRecentlyViewed(card.id);
  }, [slug, card]);

  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [galleryOpen]);

  const similar = useMemo(() => {
    if (!card) return [];
    const same = cards.filter((c) => c.category === card.category && c.id !== card.id);
    const rest = cards
      .filter((c) => c.id !== card.id && c.category !== card.category)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return [...same, ...rest].slice(0, 4);
  }, [card]);

  if (!card) {
    return (
      <div className="App bg-ivory min-h-screen" data-testid="product-not-found">
        <Header />
        <main className="pt-40 pb-40 text-center px-6">
          <p className="font-serif italic text-4xl text-taupe">This invitation could not be found.</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 border border-espresso px-8 py-4 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-espresso hover:bg-espresso hover:text-cream transition-colors"
          >
            Back to the shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const pair = isPair(card);
  const activeVar = card.variants?.[variantIdx];
  const basePrice = activeVar?.price ?? card.price;

  const shareCard = async () => {
    const url = `${window.location.origin}/shop/${slugify(card.id)}`;
    try {
      if (navigator.share) await navigator.share({ title: card.id, text: `${card.id} — Easy Wedding Cards`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <div className="App bg-ivory min-h-screen" data-testid="product-detail-page">
      <Header />
      <Toaster />

      <main className="pt-28 md:pt-36">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe flex items-center flex-wrap gap-x-2">
            <Link to="/" data-testid="breadcrumb-home" className="hover:text-espresso transition-colors">Home</Link>
            <span className="text-taupe/50">—</span>
            <Link to="/shop" data-testid="breadcrumb-shop" className="hover:text-espresso transition-colors">The Shop</Link>
            <span className="text-taupe/50">—</span>
            <span className="text-espresso">{card.id}</span>
          </nav>

          {/* Detail */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="lg:sticky lg:top-28">
              <button
                onClick={() => {
                  setGalleryIndex(imageIdx);
                  setGalleryOpen(true);
                }}
                aria-label="Open full screen"
                data-testid="detail-enlarge"
                className="block w-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                  <img src={card.images[imageIdx]} alt={card.id} className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 right-3 bg-ivory/85 px-3 py-1 font-sans text-[0.52rem] uppercase tracking-[0.16em] text-espresso">
                    Tap to enlarge
                  </span>
                </div>
              </button>
              {card.images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {card.images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIdx(idx)}
                      data-testid={`thumb-${idx}`}
                      className={`h-24 w-20 overflow-hidden border transition-colors ${
                        idx === imageIdx ? "border-espresso" : "border-espresso/15 hover:border-espresso/40"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.26em] text-rose">{card.category}</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h1 className="font-serif text-5xl md:text-6xl text-espresso leading-[0.95]">{card.id}</h1>
                <button
                  onClick={() => toggle(card.id)}
                  aria-label="Toggle favorite"
                  data-testid="detail-favorite"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-espresso/20 hover:border-espresso transition-colors"
                >
                  <Heart
                    size={17}
                    strokeWidth={1.5}
                    className={favorites.includes(card.id) ? "fill-rose text-rose" : "text-espresso"}
                  />
                </button>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-4xl text-espresso" data-testid="detail-price">
                  {money(unit(basePrice, pair))}
                </span>
                <span className="font-sans text-xs text-taupe">{pair ? "/ pair · 2 cards" : "/ card"}</span>
              </div>

              {card.description && (
                <p className="mt-7 font-sans font-light text-base text-taupe leading-relaxed max-w-md">
                  {card.description}
                </p>
              )}

              {((activeVar?.size ?? card.size) || (activeVar?.material ?? card.material)) && (
                <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-espresso/10 pt-7 font-sans text-xs max-w-sm">
                  {(activeVar?.size ?? card.size) && (
                    <>
                      <dt className="uppercase tracking-[0.16em] text-taupe">Size</dt>
                      <dd className="text-espresso">{activeVar?.size ?? card.size}</dd>
                    </>
                  )}
                  {(activeVar?.material ?? card.material) && (
                    <>
                      <dt className="uppercase tracking-[0.16em] text-taupe">Material</dt>
                      <dd className="text-espresso">{activeVar?.material ?? card.material}</dd>
                    </>
                  )}
                </dl>
              )}

              {card.variants && card.variants.length > 1 && (
                <div className="mt-8">
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-taupe mb-3">Finish</p>
                  <div className="flex flex-wrap gap-3">
                    {card.variants.map((v, i) => {
                      const on = i === variantIdx;
                      return (
                        <button
                          key={i}
                          onClick={() => setVariantIdx(i)}
                          data-testid={`variant-${i}`}
                          className={`border px-4 py-2.5 text-left transition-colors duration-200 ${
                            on ? "border-espresso bg-espresso/5" : "border-espresso/20 hover:border-espresso/50"
                          }`}
                        >
                          <span className="block font-sans text-xs text-espresso">{v.name || v.size}</span>
                          <span className="block font-sans text-[0.62rem] text-taupe mt-0.5">
                            {money(unit(v.price, pair))} {pair ? "/ pair" : "/ card"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi Easy Wedding Cards, I'd love to order "${card.id}"${activeVar?.name ? ` (${activeVar.name})` : ""}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="detail-whatsapp"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-espresso text-cream px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] transition-colors hover:bg-deepRose"
                >
                  Enquire on WhatsApp <ArrowUpRight size={15} strokeWidth={1.5} />
                </a>
                <button
                  onClick={shareCard}
                  data-testid="detail-share"
                  className="inline-flex items-center justify-center gap-2 border border-espresso px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-espresso hover:text-cream"
                >
                  <Share2 size={14} strokeWidth={1.5} /> Share
                </button>
              </div>

              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-taupe hover:text-espresso transition-colors"
              >
                <ArrowLeft size={13} strokeWidth={1.5} /> Back to all invitations
              </Link>
            </div>
          </div>

          {/* You may also like */}
          {similar.length > 0 && (
            <section className="mt-28 md:mt-36 border-t border-espresso/10 pt-14" data-testid="similar-section">
              <p className="font-sans text-[0.66rem] uppercase tracking-[0.3em] text-rose mb-3">You may also like</p>
              <h2 className="font-serif text-espresso text-4xl md:text-5xl leading-none mb-12">
                More from <span className="italic">the collection.</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                {similar.map((c) => (
                  <ProductTile
                    key={c.id}
                    c={c}
                    isFavorite={favorites.includes(c.id)}
                    onToggleFavorite={toggle}
                    testidPrefix="similar-card"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recently viewed */}
          {recent.length > 0 && (
            <section className="mt-24 md:mt-32 border-t border-espresso/10 pt-14" data-testid="recently-viewed">
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.24em] text-taupe mb-6">Recently viewed</p>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {recent.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop/${slugify(c.id)}`}
                    data-testid={`recent-${slugify(c.id)}`}
                    className="group shrink-0 w-28 sm:w-32"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-beige">
                      <img
                        src={c.images[0]}
                        alt={c.id}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 font-serif text-base text-espresso leading-tight">{c.id}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="mt-28">
        <Footer />
      </div>

      <AnimatePresence>
        {galleryOpen && (
          <GalleryLightbox
            images={card.images}
            index={galleryIndex}
            setIndex={setGalleryIndex}
            onClose={() => setGalleryOpen(false)}
            alt={card.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
