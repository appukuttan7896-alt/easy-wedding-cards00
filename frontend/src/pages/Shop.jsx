import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, X, ChevronLeft, ChevronRight, Share2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { IMAGES } from "../data/landing";
import cardsData from "../data/cards.json";

const PAGE_SIZE = 8;
const WHATSAPP_NUMBER = "919526577999";
const EASE = [0.22, 1, 0.36, 1];

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23ECE4D8'%3E%3Crect width='400' height='500'/%3E%3C/svg%3E";

const imgUrl = (u) => (typeof u === "string" && u.startsWith("http") ? u : FALLBACK);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const priceLabel = (c) =>
  c.category === "Odambady" ? `₹${(c.price * 2).toLocaleString()} / pair` : `₹${c.price.toLocaleString()} each`;

const ShopCard = memo(function ShopCard({ c, onSelect, onToggleFavorite, isFavorite }) {
  return (
    <div
      data-testid={`product-card-${slug(c.id)}`}
      onClick={() => onSelect(c)}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-cream">
        <img
          src={imgUrl(c.images[0])}
          alt={c.id}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(c.id);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-testid={`favorite-${slug(c.id)}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/80 backdrop-blur-sm transition-colors duration-300 hover:bg-ivory"
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={isFavorite ? "fill-rose text-rose" : "text-espresso"}
          />
        </button>
        {c.featured && (
          <span className="absolute left-3 top-3 bg-ivory/85 backdrop-blur-sm px-3 py-1 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-espresso">
            Featured
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-5 opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <span className="bg-espresso/90 backdrop-blur-sm text-cream px-5 py-2.5 font-sans text-[0.62rem] uppercase tracking-[0.22em]">
            View Invitation
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl text-espresso leading-none">{c.id}</h3>
          <p className="mt-1.5 font-sans text-[0.6rem] uppercase tracking-[0.22em] text-taupe">
            {c.category}
          </p>
        </div>
        <p className="font-sans text-xs text-espresso whitespace-nowrap">{priceLabel(c)}</p>
      </div>
    </div>
  );
});

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";

  const items = useMemo(() => (Array.isArray(cardsData) ? cardsData : []), []);

  const categories = useMemo(() => {
    const cats = new Set(items.map((c) => c.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [items]);

  const circles = useMemo(() => {
    const result = [{ label: "All Cards", cat: "All", image: IMAGES.hero }];
    for (const cat of categories) {
      if (cat === "All") continue;
      const first = items.find((c) => c.category === cat);
      result.push({ label: cat, cat, image: first?.images?.[0] ?? IMAGES.hero });
    }
    return result;
  }, [categories, items]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [active, setActive] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  // sync category when URL param changes
  useEffect(() => {
    setCategory(urlCategory);
    setVisible(PAGE_SIZE);
  }, [urlCategory]);

  // deep-link to a card via #card=
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#card=")) {
      const cardId = decodeURIComponent(hash.replace("#card=", ""));
      const found = items.find((c) => c.id === cardId);
      if (found) setActive(found);
    }
  }, [items]);

  // reset modal state when the active card changes
  useEffect(() => {
    if (active) {
      setSelectedVariantIdx(0);
      setSelectedImageIndex(0);
      setGalleryIndex(0);
      setGalleryOpen(false);
      window.history.replaceState(null, "", `#card=${encodeURIComponent(active.id)}`);
    } else if (window.location.hash.startsWith("#card=")) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [active]);

  // body scroll lock while a modal is open
  useEffect(() => {
    document.body.style.overflow = active || galleryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, galleryOpen]);

  // keyboard navigation for the fullscreen gallery
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

  const setCategoryAndReset = (c) => {
    setVisible(PAGE_SIZE);
    setActive(null);
    setSearchParams(c === "All" ? {} : { category: c }, { replace: true });
  };

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const shareCard = async (c) => {
    const url = `${window.location.origin}/shop#card=${encodeURIComponent(c.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: c.id, text: `${c.id} — Easy Wedding Cards`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* dismissed */
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = items;
    if (category !== "All") result = result.filter((c) => c.category === category);
    if (q) {
      result = result.filter((c) =>
        [c.id, c.description, c.category, c.size, c.material, ...(c.variants?.flatMap((v) => [v.name, v.size, v.material]) ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (showFavorites) result = result.filter((c) => favorites.includes(c.id));
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [items, category, query, sort, showFavorites, favorites]);

  const page = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const isOdambadi = active?.category === "Odambady";
  const activeVar = active?.variants?.[selectedVariantIdx];
  const unitPrice = activeVar?.price ?? active?.price ?? 0;

  const sortPills = [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Low to High" },
    { key: "price-desc", label: "High to Low" },
  ];

  return (
    <div className="App bg-ivory min-h-screen" data-testid="shop-page">
      <Header />
      <Toaster />

      <main className="pt-28 md:pt-36">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-taupe">
            <Link to="/" className="link-underline hover:text-espresso transition-colors" data-testid="breadcrumb-home">
              Easy Wedding Cards
            </Link>
            <span className="mx-2 text-taupe/50">/</span>
            <span className="text-espresso">Wedding Cards</span>
          </nav>

          {/* Title */}
          <div className="mt-10 md:mt-14 max-w-3xl">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.34em] text-rose mb-6">The Collection</p>
            <h1 className="font-serif text-espresso leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl">
              Wedding invitation <span className="italic">cards</span>.
            </h1>
            <p className="mt-6 font-sans font-light text-base md:text-lg text-taupe max-w-xl leading-relaxed">
              Handcrafted invitations for celebrations that are intimate, grand, timeless and entirely yours.
            </p>
          </div>

          {/* Category circles */}
          <div className="mt-12 md:mt-16 flex gap-6 md:gap-10 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 snap-x">
            {circles.map((c) => {
              const activeCat = category === c.cat;
              return (
                <button
                  key={c.cat}
                  onClick={() => setCategoryAndReset(c.cat)}
                  data-testid={`category-circle-${slug(c.cat)}`}
                  className="flex flex-col items-center gap-3 shrink-0 snap-start group"
                >
                  <span
                    className={`block h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden ring-1 transition-all duration-300 ${
                      activeCat ? "ring-rose ring-2" : "ring-espresso/15 group-hover:ring-espresso/40"
                    }`}
                  >
                    <img src={imgUrl(c.image)} alt={c.label} className="h-full w-full object-cover" />
                  </span>
                  <span
                    className={`font-sans text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${
                      activeCat ? "text-espresso" : "text-taupe group-hover:text-espresso"
                    }`}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter bar */}
          <div className="mt-12 md:mt-16 flex flex-col gap-6 border-t border-espresso/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-taupe" data-testid="results-count">
                {filtered.length} {filtered.length === 1 ? "invitation" : "invitations"}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {sortPills.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      setSort(p.key);
                      setVisible(PAGE_SIZE);
                    }}
                    data-testid={`sort-${p.key}`}
                    className={`border px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      sort === p.key
                        ? "border-espresso bg-espresso text-cream"
                        : "border-espresso/25 text-espresso hover:border-espresso"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}

                <div className="flex items-center gap-2 border border-espresso/25 px-3 py-2">
                  <Search size={14} strokeWidth={1.5} className="text-taupe" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    placeholder="Search"
                    aria-label="Search cards"
                    data-testid="shop-search-input"
                    className="w-24 md:w-32 bg-transparent outline-none font-sans text-xs text-espresso placeholder:text-taupe/60"
                  />
                </div>

                <button
                  onClick={() => {
                    setShowFavorites((v) => !v);
                    setVisible(PAGE_SIZE);
                  }}
                  data-testid="favorites-toggle"
                  className={`flex items-center gap-2 border px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    showFavorites
                      ? "border-rose bg-rose text-cream"
                      : "border-espresso/25 text-espresso hover:border-espresso"
                  }`}
                >
                  <Heart size={13} strokeWidth={1.5} className={showFavorites ? "fill-cream" : ""} />
                  Favorites ({favorites.length})
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {page.length === 0 ? (
            <div className="py-32 text-center" data-testid="empty-state">
              <p className="font-serif italic text-3xl text-taupe">Nothing here yet.</p>
              <p className="mt-3 font-sans text-sm text-taupe">Try another category or clear your search.</p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 md:gap-y-20">
              {page.map((c) => (
                <ShopCard
                  key={c.id}
                  c={c}
                  onSelect={setActive}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(c.id)}
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                data-testid="load-more-btn"
                className="border border-espresso/30 px-10 py-4 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-espresso transition-colors duration-500 hover:bg-espresso hover:text-cream"
              >
                Load more ({filtered.length - visible} left)
              </button>
            </div>
          )}
        </div>
      </main>

      <div className="mt-28">
        <Footer />
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start md:items-center justify-center overflow-y-auto bg-espresso/50 backdrop-blur-sm p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
            data-testid="quick-view-modal"
          >
            <motion.div
              className="relative w-full max-w-5xl bg-ivory my-4 md:my-0"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                data-testid="modal-close"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/80 backdrop-blur-sm text-espresso hover:bg-cream transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Gallery */}
                <div className="p-5 md:p-8 bg-cream">
                  <button
                    onClick={() => {
                      setGalleryIndex(selectedImageIndex);
                      setGalleryOpen(true);
                    }}
                    aria-label="Open full screen"
                    data-testid="modal-enlarge"
                    className="block w-full overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                      <img
                        src={imgUrl(active.images[selectedImageIndex])}
                        alt={active.id}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 bg-ivory/85 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-[0.18em] text-espresso">
                        Tap to enlarge
                      </span>
                    </div>
                  </button>
                  {active.images.length > 1 && (
                    <div className="mt-4 flex gap-3">
                      {active.images.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          data-testid={`thumb-${idx}`}
                          className={`h-16 w-14 overflow-hidden border-2 transition-colors ${
                            idx === selectedImageIndex ? "border-espresso" : "border-transparent"
                          }`}
                        >
                          <img src={imgUrl(src)} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 md:p-10 flex flex-col">
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-rose">
                    {active.category || "Easy Wedding Cards"}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h2 className="font-serif text-4xl md:text-5xl text-espresso leading-none">{active.id}</h2>
                    <button
                      onClick={() => toggleFavorite(active.id)}
                      aria-label="Toggle favorite"
                      data-testid="modal-favorite"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-espresso/20 transition-colors hover:border-espresso"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.5}
                        className={favorites.includes(active.id) ? "fill-rose text-rose" : "text-espresso"}
                      />
                    </button>
                  </div>

                  {active.description && (
                    <p className="mt-5 font-sans font-light text-sm md:text-base text-taupe leading-relaxed">
                      {active.description}
                    </p>
                  )}

                  {((activeVar?.size ?? active.size) || (activeVar?.material ?? active.material)) && (
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-sans text-xs text-taupe">
                      {(activeVar?.size ?? active.size) && (
                        <span>
                          <span className="uppercase tracking-[0.18em] text-espresso/70">Size</span>{" "}
                          {activeVar?.size ?? active.size}
                        </span>
                      )}
                      {(activeVar?.material ?? active.material) && (
                        <span>
                          <span className="uppercase tracking-[0.18em] text-espresso/70">Material</span>{" "}
                          {activeVar?.material ?? active.material}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Variants */}
                  {active.variants && active.variants.length > 1 && (
                    <div className="mt-7">
                      <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-taupe mb-3">Variant</p>
                      <div className="flex flex-wrap gap-3">
                        {active.variants.map((v, i) => {
                          const selected = i === selectedVariantIdx;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedVariantIdx(i)}
                              data-testid={`variant-${i}`}
                              className={`border px-4 py-2.5 text-left transition-colors duration-200 ${
                                selected ? "border-espresso bg-espresso/5" : "border-espresso/20 hover:border-espresso/50"
                              }`}
                            >
                              <span className="block font-sans text-xs text-espresso">{v.name || v.size}</span>
                              <span className="block font-sans text-[0.65rem] text-taupe mt-0.5">
                                ₹{(isOdambadi ? v.price * 2 : v.price).toLocaleString()}
                                {isOdambadi ? " / pair" : " / card"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-8 border-t border-espresso/10 pt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl text-espresso">
                        ₹{(isOdambadi ? unitPrice * 2 : unitPrice).toLocaleString()}
                      </span>
                      <span className="font-sans text-xs text-taupe">{isOdambadi ? "/ pair" : "/ card"}</span>
                    </div>
                    {isOdambadi && (
                      <p className="mt-1 font-sans text-[0.65rem] uppercase tracking-[0.16em] text-taupe">
                        1 pair · 2 cards
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hi Easy Wedding Cards, I'd love to order "${active.id}"${
                          activeVar?.name ? ` (${activeVar.name})` : ""
                        }.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="modal-whatsapp"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-espresso text-cream px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] transition-colors hover:bg-deepRose"
                    >
                      Order on WhatsApp <ArrowUpRight size={15} strokeWidth={1.5} />
                    </a>
                    <button
                      onClick={() => shareCard(active)}
                      data-testid="modal-share"
                      className="inline-flex items-center justify-center gap-2 border border-espresso px-6 py-4 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-espresso hover:text-cream"
                    >
                      <Share2 size={14} strokeWidth={1.5} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen gallery lightbox */}
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
                      className={`h-1.5 w-8 rounded-full transition-colors ${
                        galleryIndex === i ? "bg-cream" : "bg-cream/30"
                      }`}
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
