import { useState, useEffect, useMemo, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, X, ChevronLeft, ChevronRight, Share2, ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import cardsData from "../data/cards.json";

const PAGE_SIZE = 8;
const WHATSAPP_NUMBER = "910000000000"; // placeholder — replace with your number
const EASE = [0.22, 1, 0.36, 1];
const PAIR_CATEGORY = "Duo";

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23ECE4D8'%3E%3Crect width='400' height='500'/%3E%3C/svg%3E";

const imgUrl = (u) => (typeof u === "string" && u.startsWith("http") ? u : FALLBACK);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const isPair = (c) => c.category === PAIR_CATEGORY;
const unit = (p, pair) => (pair ? p * 2 : p);
const money = (n) => `₹${n.toLocaleString()}`;

// varied heights for the editorial masonry
const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[5/7]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

const ProductTile = memo(function ProductTile({ c, index, onSelect, onToggleFavorite, isFavorite }) {
  return (
    <div className="mb-12 md:mb-16 break-inside-avoid" data-testid={`product-card-${slug(c.id)}`}>
      <div className="group cursor-pointer" onClick={() => onSelect(c)}>
        <div className={`relative overflow-hidden bg-cream ${ASPECTS[index % ASPECTS.length]}`}>
          <img
            src={imgUrl(c.images[0])}
            alt={c.id}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(c.id);
            }}
            aria-label="Toggle favorite"
            data-testid={`favorite-${slug(c.id)}`}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/75 backdrop-blur-sm transition-colors duration-300 hover:bg-ivory"
          >
            <Heart size={15} strokeWidth={1.5} className={isFavorite ? "fill-rose text-rose" : "text-espresso"} />
          </button>
          {c.featured && (
            <span className="absolute left-0 top-5 bg-espresso text-cream px-3 py-1 font-sans text-[0.5rem] uppercase tracking-[0.24em]">
              Featured
            </span>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="transition-transform duration-500 ease-out group-hover:translate-x-1">
            <div className="flex items-baseline gap-3">
              <h3 className="font-serif text-2xl md:text-3xl text-espresso leading-none">{c.id}</h3>
              <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-rose">{c.category}</span>
            </div>
            <p className="mt-2 font-sans text-xs text-taupe">
              {money(unit(c.price, isPair(c)))} {isPair(c) ? "/ pair" : "/ card"}
            </p>
          </div>
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-espresso opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
            View
          </span>
        </div>
      </div>
    </div>
  );
});

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";
  const items = useMemo(() => (Array.isArray(cardsData) ? cardsData : []), []);

  const categoryCounts = useMemo(() => {
    const map = { All: items.length };
    for (const c of items) map[c.category] = (map[c.category] || 0) + 1;
    return map;
  }, [items]);
  const categories = useMemo(() => ["All", ...Object.keys(categoryCounts).filter((k) => k !== "All")], [categoryCounts]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ewc-favorites") ?? "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("ewc-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setCategory(urlCategory);
    setVisible(PAGE_SIZE);
  }, [urlCategory]);

  // deep-link ?card= to open a specific invitation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#card=")) {
      const id = decodeURIComponent(hash.replace("#card=", ""));
      const found = items.find((c) => c.id === id);
      if (found) setActive(found);
    }
  }, [items]);

  useEffect(() => {
    if (active) {
      setVariantIdx(0);
      setImageIdx(0);
      setGalleryIndex(0);
      setGalleryOpen(false);
      window.history.replaceState(null, "", `#card=${encodeURIComponent(active.id)}`);
    } else if (window.location.hash.startsWith("#card=")) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = active || galleryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, galleryOpen]);

  useEffect(() => {
    if (!galleryOpen || !active) return;
    const handler = (e) => {
      if (e.key === "Escape") setGalleryOpen(false);
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && active.images.length > 1) {
        setGalleryIndex((prev) => {
          const len = active.images.length;
          return e.key === "ArrowLeft" ? (prev - 1 + len) % len : (prev + 1) % len;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [galleryOpen, active]);

  const pickCategory = (c) => {
    setVisible(PAGE_SIZE);
    setActive(null);
    setSearchParams(c === "All" ? {} : { category: c }, { replace: true });
  };
  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const shareCard = async (c) => {
    const url = `${window.location.origin}/shop#card=${encodeURIComponent(c.id)}`;
    try {
      if (navigator.share) await navigator.share({ title: c.id, text: `${c.id} — Easy Wedding Cards`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* dismissed */
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let r = items;
    if (category !== "All") r = r.filter((c) => c.category === category);
    if (q)
      r = r.filter((c) =>
        [c.id, c.description, c.category, c.size, c.material, ...(c.variants?.flatMap((v) => [v.name, v.size, v.material]) ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    if (showFavorites) r = r.filter((c) => favorites.includes(c.id));
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else r = [...r].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return r;
  }, [items, category, query, sort, showFavorites, favorites]);

  const page = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const pair = active ? isPair(active) : false;
  const activeVar = active?.variants?.[variantIdx];
  const basePrice = activeVar?.price ?? active?.price ?? 0;

  const sortOptions = [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Price · low to high" },
    { key: "price-desc", label: "Price · high to low" },
  ];

  return (
    <div className="App bg-ivory min-h-screen" data-testid="shop-page">
      <Header />
      <Toaster />

      <main className="pt-28 md:pt-36 pb-4">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          {/* Intro */}
          <nav className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe">
            <Link to="/" data-testid="breadcrumb-home" className="link-underline hover:text-espresso transition-colors">
              Home
            </Link>
            <span className="mx-2 text-taupe/50">—</span>
            <span className="text-espresso">The Shop</span>
          </nav>

          <div className="mt-8 md:mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-espresso/10 pb-10 md:pb-14">
            <div className="max-w-2xl">
              <p className="font-sans text-[0.66rem] uppercase tracking-[0.34em] text-rose mb-5">Made to order</p>
              <h1 className="font-serif text-espresso leading-[0.94] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
                Choose the one <span className="italic">you'll</span> send.
              </h1>
            </div>
            <p className="font-sans font-light text-sm md:text-base text-taupe max-w-sm leading-relaxed lg:text-right">
              Each invitation is handcrafted to order — the paper, pressing, foil and ribbon chosen entirely by you.
            </p>
          </div>

          {/* Two-column: filter rail + masonry */}
          <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
            {/* Filter rail */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe mb-4">Category</p>
              <ul className="flex flex-wrap lg:flex-col gap-x-5 gap-y-1 lg:gap-y-2.5">
                {categories.map((c) => {
                  const on = category === c;
                  return (
                    <li key={c}>
                      <button
                        onClick={() => pickCategory(c)}
                        data-testid={`category-${slug(c)}`}
                        className={`group flex items-baseline gap-2 font-serif text-xl md:text-2xl leading-none transition-colors duration-300 ${
                          on ? "text-espresso" : "text-taupe hover:text-espresso"
                        }`}
                      >
                        <span className={`italic ${on ? "border-b border-rose pb-0.5" : ""}`}>
                          {c === "All" ? "All cards" : c}
                        </span>
                        <span className="font-sans text-[0.55rem] not-italic tracking-[0.1em] text-taupe/70">
                          {categoryCounts[c]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 lg:mt-10 pt-6 border-t border-espresso/10">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe mb-4">Sort</p>
                <div className="flex flex-col gap-2.5">
                  {sortOptions.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setSort(s.key);
                        setVisible(PAGE_SIZE);
                      }}
                      data-testid={`sort-${s.key}`}
                      className={`text-left font-sans text-xs tracking-wide transition-colors duration-300 ${
                        sort === s.key ? "text-espresso" : "text-taupe hover:text-espresso"
                      }`}
                    >
                      <span className={sort === s.key ? "border-b border-espresso pb-0.5" : ""}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 lg:mt-10 pt-6 border-t border-espresso/10 space-y-5">
                <div className="flex items-center gap-2 border-b border-espresso/25 pb-2">
                  <Search size={14} strokeWidth={1.5} className="text-taupe" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    placeholder="Search invitations"
                    aria-label="Search cards"
                    data-testid="shop-search-input"
                    className="w-full bg-transparent outline-none font-sans text-xs text-espresso placeholder:text-taupe/60"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowFavorites((v) => !v);
                    setVisible(PAGE_SIZE);
                  }}
                  data-testid="favorites-toggle"
                  className={`flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    showFavorites ? "text-rose" : "text-espresso hover:text-rose"
                  }`}
                >
                  <Heart size={13} strokeWidth={1.5} className={showFavorites ? "fill-rose text-rose" : ""} />
                  Saved ({favorites.length})
                </button>
              </div>
            </aside>

            {/* Masonry grid */}
            <section>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-taupe mb-8" data-testid="results-count">
                {filtered.length} {filtered.length === 1 ? "invitation" : "invitations"}
              </p>

              {page.length === 0 ? (
                <div className="py-24 text-center" data-testid="empty-state">
                  <p className="font-serif italic text-3xl text-taupe">Nothing here yet.</p>
                  <p className="mt-3 font-sans text-sm text-taupe">Try another category or clear your search.</p>
                </div>
              ) : (
                <div className="columns-1 sm:columns-2 xl:columns-3 gap-x-6 lg:gap-x-8">
                  {page.map((c, i) => (
                    <ProductTile
                      key={c.id}
                      c={c}
                      index={i}
                      onSelect={setActive}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(c.id)}
                    />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    data-testid="load-more-btn"
                    className="group inline-flex items-center gap-3 font-serif text-2xl md:text-3xl text-espresso"
                  >
                    <span className="border-b border-espresso/30 pb-1 group-hover:border-espresso transition-colors">
                      Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
                    </span>
                    <Plus size={18} strokeWidth={1.5} className="text-rose" />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <div className="mt-24">
        <Footer />
      </div>

      {/* Product slide-over drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-espresso/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActive(null)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[85] h-full w-full max-w-xl bg-ivory overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE }}
              data-testid="product-drawer"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-ivory/90 backdrop-blur-sm px-6 md:px-10 py-5 border-b border-espresso/10">
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-rose">
                  {active.category} — Easy Wedding Cards
                </span>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  data-testid="drawer-close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso hover:bg-espresso hover:text-cream transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="px-6 md:px-10 pb-14">
                {/* Gallery */}
                <button
                  onClick={() => {
                    setGalleryIndex(imageIdx);
                    setGalleryOpen(true);
                  }}
                  aria-label="Open full screen"
                  data-testid="drawer-enlarge"
                  className="mt-6 block w-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                    <img src={imgUrl(active.images[imageIdx])} alt={active.id} className="h-full w-full object-cover" />
                    <span className="absolute bottom-3 right-3 bg-ivory/85 px-3 py-1 font-sans text-[0.52rem] uppercase tracking-[0.16em] text-espresso">
                      Tap to enlarge
                    </span>
                  </div>
                </button>
                {active.images.length > 1 && (
                  <div className="mt-4 flex gap-3">
                    {active.images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImageIdx(idx)}
                        data-testid={`thumb-${idx}`}
                        className={`h-20 w-16 overflow-hidden border transition-colors ${
                          idx === imageIdx ? "border-espresso" : "border-espresso/15 hover:border-espresso/40"
                        }`}
                      >
                        <img src={imgUrl(src)} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="mt-9 flex items-start justify-between gap-4">
                  <h2 className="font-serif text-4xl md:text-5xl text-espresso leading-none">{active.id}</h2>
                  <button
                    onClick={() => toggleFavorite(active.id)}
                    aria-label="Toggle favorite"
                    data-testid="drawer-favorite"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-espresso/20 hover:border-espresso transition-colors"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.5}
                      className={favorites.includes(active.id) ? "fill-rose text-rose" : "text-espresso"}
                    />
                  </button>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-espresso">{money(unit(basePrice, pair))}</span>
                  <span className="font-sans text-xs text-taupe">{pair ? "/ pair · 2 cards" : "/ card"}</span>
                </div>

                {active.description && (
                  <p className="mt-6 font-sans font-light text-sm md:text-base text-taupe leading-relaxed">
                    {active.description}
                  </p>
                )}

                {((activeVar?.size ?? active.size) || (activeVar?.material ?? active.material)) && (
                  <dl className="mt-7 grid grid-cols-2 gap-y-3 border-t border-espresso/10 pt-6 font-sans text-xs">
                    {(activeVar?.size ?? active.size) && (
                      <>
                        <dt className="uppercase tracking-[0.16em] text-taupe">Size</dt>
                        <dd className="text-espresso">{activeVar?.size ?? active.size}</dd>
                      </>
                    )}
                    {(activeVar?.material ?? active.material) && (
                      <>
                        <dt className="uppercase tracking-[0.16em] text-taupe">Material</dt>
                        <dd className="text-espresso">{activeVar?.material ?? active.material}</dd>
                      </>
                    )}
                  </dl>
                )}

                {active.variants && active.variants.length > 1 && (
                  <div className="mt-7">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-taupe mb-3">Finish</p>
                    <div className="flex flex-wrap gap-3">
                      {active.variants.map((v, i) => {
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

                <div className="mt-9 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Easy Wedding Cards, I'd love to order "${active.id}"${activeVar?.name ? ` (${activeVar.name})` : ""}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="drawer-whatsapp"
                    className="inline-flex items-center justify-center gap-2 bg-espresso text-cream px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] transition-colors hover:bg-deepRose"
                  >
                    Enquire on WhatsApp <ArrowUpRight size={15} strokeWidth={1.5} />
                  </a>
                  <button
                    onClick={() => shareCard(active)}
                    data-testid="drawer-share"
                    className="inline-flex items-center justify-center gap-2 border border-espresso px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-espresso hover:text-cream"
                  >
                    <Share2 size={14} strokeWidth={1.5} /> Share this invitation
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {galleryOpen && active && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-espresso/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setGalleryOpen(false)}
            data-testid="gallery-lightbox"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGalleryOpen(false);
              }}
              aria-label="Close gallery"
              data-testid="gallery-close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <img
              src={imgUrl(active.images[galleryIndex])}
              alt={active.id}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            {active.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryIndex((p) => (p - 1 + active.images.length) % active.images.length);
                  }}
                  aria-label="Previous"
                  className="absolute left-4 md:left-8 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryIndex((p) => (p + 1) % active.images.length);
                  }}
                  aria-label="Next"
                  className="absolute right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-6 flex gap-2">
                  {active.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex(i);
                      }}
                      className={`h-1.5 w-8 rounded-full transition-colors ${galleryIndex === i ? "bg-cream" : "bg-cream/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
