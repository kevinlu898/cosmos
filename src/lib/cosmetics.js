import { useEffect, useState } from "react";
import { supabase } from "./database";
import { getOwnedItems } from "./utils";

export const COSMETIC_ITEMS = ["hat", "scarf", "shoes"];

export function cosmeticSrc(animalKey, item) {
  return `/animals/cosmetics/${animalKey}-${item}.svg`;
}

export function cosmeticsFromOwned(owned) {
  return COSMETIC_ITEMS.filter((item) => (owned?.[item] ?? 0) >= 1);
}

// Get all owned cosmetics
let inflight = null;

export function getOwnedCosmetics() {
  if (!inflight) {
    inflight = (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id ?? null;
      const owned = await getOwnedItems(userId);
      return cosmeticsFromOwned(owned);
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}
// Returns which cosmetics the player is currently wearing.
export function useOwnedCosmetics() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let active = true;
    getOwnedCosmetics().then((i) => {
      if (active) setItems(i);
    });
    return () => {
      active = false;
    };
  }, []);
  return items;
}
