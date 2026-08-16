import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { imgUrl, slugify, isPair, unit, money } from "../../lib/shop";

export const ProductTile = memo(function ProductTile({ c, isFavorite, onToggleFavorite, testidPrefix = "product-card" }) {
  const pair = isPair(c);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/shop/${slugify(c.id)}`}
        data-testid={`${testidPrefix}-${slugify(c.id)}`}
        className="group block"
      >
      <div className="relative overflow-hidden aspect-[4/5] bg-cream">
        <img
          src={imgUrl(c.images[0])}
          alt={c.id}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.05]"
        />
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(c.id);
            }}
            aria-label="Toggle favorite"
            data-testid={`favorite-${slugify(c.id)}`}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/75 backdrop-blur-sm transition-colors duration-300 hover:bg-ivory"
          >
            <Heart size={15} strokeWidth={1.5} className={isFavorite ? "fill-rose text-rose" : "text-espresso"} />
          </button>
        )}
        {c.featured && (
          <span className="absolute left-0 top-4 bg-espresso text-cream px-3 py-1 font-sans text-[0.5rem] uppercase tracking-[0.24em]">
            Featured
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="transition-transform duration-500 ease-out group-hover:translate-x-1">
          <h3 className="font-serif text-xl md:text-2xl text-espresso leading-none">{c.id}</h3>
          <p className="mt-1.5 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-rose">{c.category}</p>
        </div>
        <p className="font-sans text-xs text-espresso whitespace-nowrap">
          {money(unit(c.price, pair))}
          <span className="text-taupe">{pair ? " /pair" : ""}</span>
        </p>
      </div>
    </Link>
    </motion.div>
  );
});
