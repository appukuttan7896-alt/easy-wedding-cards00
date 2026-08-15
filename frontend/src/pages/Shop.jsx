import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Heart, Plus } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { ProductTile } from "../components/shop/ProductTile";
import {
  cards,
  categoryCounts,
  useFavorites,
  getRecentlyViewed,
  slugify,
  PAGE_SIZE,
} from "../lib/shop";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "All";

  const counts = useMemo(() => categoryCounts(), []);
  const categories = useMemo(() => ["All", ...Object.keys(counts).filter((k) => k !== "All")], [counts]);

  const { favorites, toggle } = useFavorites();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showFavorites, setShowFavorites] = useState(false);

  const [recent] = useState(() =>
    getRecentlyViewed()
      .map((id) => cards.find((c) => c.id === id))
      .filter(Boolean)
      .slice(0, 6),
  );

  useEffect(() => {
    setCategory(urlCategory);
    setVisible(PAGE_SIZE);
  }, [urlCategory]);

  const pickCategory = (c) => {
    setVisible(PAGE_SIZE);
    setSearchParams(c === "All" ? {} : { category: c }, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let r = cards;
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
  }, [category, query, sort, showFavorites, favorites]);

  const page = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="App bg-ivory min-h-screen" data-testid="shop-page">
      <Header />
      <Toaster />

      <main className="pt-28 md:pt-36">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          {/* Intro */}
          <nav className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-taupe">
            <Link to="/" data-testid="breadcrumb-home" className="link-underline hover:text-espresso transition-colors">
              Home
            </Link>
            <span className="mx-2 text-taupe/50">—</span>
            <span className="text-espresso">The Shop</span>
          </nav>

          <div className="mt-8 md:mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
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
        </div>

        {/* Recently viewed strip */}
        {recent.length > 0 && (
          <div className="mt-12 border-y border-espresso/10 bg-cream/50" data-testid="recently-viewed">
            <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 py-6">
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.24em] text-taupe mb-4">Recently viewed</p>
              <div className="flex gap-5 overflow-x-auto pb-1">
                {recent.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop/${slugify(c.id)}`}
                    data-testid={`recent-${slugify(c.id)}`}
                    className="group shrink-0 w-24 sm:w-28"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-beige">
                      <img
                        src={c.images[0]}
                        alt={c.id}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 font-serif text-sm text-espresso leading-tight">{c.id}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sticky top filter bar */}
        <div className="sticky top-16 md:top-20 z-30 bg-ivory/90 backdrop-blur-md border-b border-espresso/10">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 lg:mx-0 lg:px-0">
              {categories.map((c) => {
                const on = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => pickCategory(c)}
                    data-testid={`category-${slugify(c)}`}
                    className={`shrink-0 border px-4 py-2 font-sans text-[0.6rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      on ? "border-espresso bg-espresso text-cream" : "border-espresso/20 text-espresso hover:border-espresso"
                    }`}
                  >
                    {c === "All" ? "All" : c}
                    <span className={`ml-1.5 ${on ? "text-cream/60" : "text-taupe/70"}`}>{counts[c]}</span>
                  </button>
                );
              })}
            </div>

            {/* Search + sort + saved */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 border-b border-espresso/25 pb-1.5">
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
                  className="w-24 md:w-36 bg-transparent outline-none font-sans text-xs text-espresso placeholder:text-taupe/60"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setVisible(PAGE_SIZE);
                }}
                data-testid="sort-select"
                aria-label="Sort"
                className="bg-transparent border-b border-espresso/25 pb-1.5 font-sans text-xs text-espresso outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              <button
                onClick={() => {
                  setShowFavorites((v) => !v);
                  setVisible(PAGE_SIZE);
                }}
                data-testid="favorites-toggle"
                className={`flex items-center gap-1.5 font-sans text-[0.6rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  showFavorites ? "text-rose" : "text-espresso hover:text-rose"
                }`}
              >
                <Heart size={13} strokeWidth={1.5} className={showFavorites ? "fill-rose text-rose" : ""} />
                Saved ({favorites.length})
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 pt-10">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-taupe mb-8" data-testid="results-count">
            {filtered.length} {filtered.length === 1 ? "invitation" : "invitations"}
          </p>

          {page.length === 0 ? (
            <div className="py-24 text-center" data-testid="empty-state">
              <p className="font-serif italic text-3xl text-taupe">Nothing here yet.</p>
              <p className="mt-3 font-sans text-sm text-taupe">Try another category or clear your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 md:gap-y-20">
              {page.map((c) => (
                <ProductTile key={c.id} c={c} isFavorite={favorites.includes(c.id)} onToggleFavorite={toggle} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-16 flex justify-center">
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
        </div>
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
