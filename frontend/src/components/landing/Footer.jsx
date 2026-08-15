import { IMAGES } from "../../data/landing";

const LINKS = [
  { label: "Wedding Cards", href: "/shop" },  { label: "Gifts", href: "/gifts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Instagram", href: "https://instagram.com" },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-cream text-espresso border-t border-espresso/10">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div>
            <span
              role="img"
              aria-label="Easy Wedding Cards"
              className="block h-28 w-32 md:h-32 md:w-40"
              style={{
                backgroundColor: "#B07E80",
                WebkitMaskImage: `url("${IMAGES.logo}")`,
                maskImage: `url("${IMAGES.logo}")`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            <p className="mt-5 font-serif italic text-lg md:text-xl text-taupe">
              Invitations for beautiful beginnings.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-testid={`footer-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="link-underline font-sans text-[0.68rem] uppercase tracking-[0.22em] text-taupe hover:text-espresso transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 pt-8 border-t border-espresso/10 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-taupe/70">
            &copy; {new Date().getFullYear()} Easy Wedding Cards
          </p>
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-taupe/70">
            The first glimpse of your wedding.
          </p>
        </div>
      </div>
    </footer>
  );
};
