import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { IMAGES } from "../../data/landing";

const NAV = [
  { label: "Wedding Cards", href: "/shop", primary: true },
  { label: "Gifts", href: "/gifts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Header = ({ heroLogo = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ivory/90 backdrop-blur-md border-b border-espresso/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-500 ${heroLogo && !scrolled ? "h-24 md:h-32" : "h-16 md:h-20"}`}>
          <a
            href="/"
            data-testid="logo-link"
            className="flex items-center"
          >
            <span
              role="img"
              aria-label="Easy Wedding Cards"
              className={`block transition-all duration-500 ${
                heroLogo && !scrolled ? "h-16 w-20 md:h-24 md:w-28" : "h-11 w-14 md:h-12 md:w-16"
              }`}
              style={{
                backgroundColor: "#B07E80",
                WebkitMaskImage: `url("${IMAGES.logo}")`,
                maskImage: `url("${IMAGES.logo}")`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`link-underline font-sans text-[0.72rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  item.primary
                    ? "text-espresso font-medium"
                    : "text-taupe hover:text-espresso font-light"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="/shop"
              data-testid="header-shop-cta"
              className="group arrow-parent inline-flex items-center gap-2 border border-espresso/70 px-6 py-2.5 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-espresso transition-colors duration-500 hover:bg-espresso hover:border-espresso hover:text-cream"
            >
              Shop Cards
            </a>
          </div>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-espresso p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-ivory border-b border-espresso/10"
          >
            <nav className="px-6 py-8 flex flex-col gap-6">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setOpen(false)}
                  className="font-serif text-3xl text-espresso"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/shop"
                data-testid="mobile-shop-cta"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block border border-espresso px-6 py-3 text-center font-sans text-xs uppercase tracking-[0.22em] text-espresso"
              >
                Shop Cards
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
