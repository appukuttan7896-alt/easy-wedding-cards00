import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { imgUrl } from "../../lib/shop";

export function GalleryLightbox({ images, index, setIndex, onClose, alt }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && images.length > 1) {
        setIndex((prev) => {
          const len = images.length;
          return e.key === "ArrowLeft" ? (prev - 1 + len) % len : (prev + 1) % len;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images, setIndex, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-espresso/95 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-testid="gallery-lightbox"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close gallery"
        data-testid="gallery-close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <img
        src={imgUrl(images[index])}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((p) => (p - 1 + images.length) % images.length);
            }}
            aria-label="Previous"
            className="absolute left-4 md:left-8 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((p) => (p + 1) % images.length);
            }}
            aria-label="Next"
            className="absolute right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-6 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 w-8 rounded-full transition-colors ${index === i ? "bg-cream" : "bg-cream/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
