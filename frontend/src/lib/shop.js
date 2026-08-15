import { useState, useEffect, useCallback } from "react";
import cardsData from "../data/cards.json";

export const PAGE_SIZE = 8;
export const WHATSAPP_NUMBER = "910000000000"; // placeholder — replace with your number
export const PAIR_CATEGORY = "Duo";

export const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23ECE4D8'%3E%3Crect width='400' height='500'/%3E%3C/svg%3E";

export const cards = Array.isArray(cardsData) ? cardsData : [];

export const imgUrl = (u) => (typeof u === "string" && u.startsWith("http") ? u : FALLBACK);
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const isPair = (c) => c?.category === PAIR_CATEGORY;
export const unit = (p, pair) => (pair ? p * 2 : p);
export const money = (n) => `₹${Number(n).toLocaleString()}`;

export const getCardBySlug = (slug) => cards.find((c) => slugify(c.id) === slug);

export const categoryCounts = () => {
  const map = { All: cards.length };
  for (const c of cards) map[c.category] = (map[c.category] || 0) + 1;
  return map;
};

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

const FAV_KEY = "ewc-favorites";
const RECENT_KEY = "ewc-recent";
const RECENT_MAX = 12;

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => read(FAV_KEY, []));
  useEffect(() => write(FAV_KEY, favorites), [favorites]);
  const toggle = useCallback(
    (id) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  return { favorites, toggle };
}

export const getRecentlyViewed = () => read(RECENT_KEY, []);
export const addRecentlyViewed = (id) => {
  const next = [id, ...getRecentlyViewed().filter((x) => x !== id)].slice(0, RECENT_MAX);
  write(RECENT_KEY, next);
  return next;
};
