import { IMAGES } from "../../data/landing";

const LINKS = [
  { label: "Wedding Cards", href: "/shop" },  { label: "Gifts", href: "/gifts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Instagram", href: "https://instagram.com" },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-espresso text-cream border-t border-cream/10">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div>
            <img
              src={IMAGES.logo}
              alt="Easy Wedding Cards"
              className="w-44 md:w-52 h-auto select-none"
            />
            <p className="mt-5 font-serif italic text-lg md:text-xl text-roseSoft">
              Invitations for beautiful beginnings.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                data-testid={`footer-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="link-underline font-sans text-[0.68rem] uppercase tracking-[0.22em] text-cream/70 hover:text-cream transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
            &copy; {new Date().getFullYear()} Easy Wedding Cards
          </p>
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-cream/40">
            The first glimpse of your wedding.
          </p>
        </div>
      </div>
    </footer>
  );
};
