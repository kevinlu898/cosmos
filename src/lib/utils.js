import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { update, getById } from "./database";

const SHOP_ITEM_COLUMNS = [
  "hat",
  "shoes",
  "scarf",
  "streak_saver",
  "small_hint",
];

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getStardust(user_id) {
  if (!user_id) {
    return 0;
  }

  const therow = await getById("profiles", user_id, { column: "user_id" });
  return therow?.stardust ?? 0;
}

export async function addStardust(user_id, num) {
  if (!user_id) {
    throw new Error("addStardust requires a user_id");
  }

  const currentStardust = await getStardust(user_id);
  const newStardust = currentStardust + num;
  await update(
    "profiles",
    user_id,
    { stardust: newStardust },
    { column: "user_id" },
  );

  return newStardust;
}

export async function buyItem(user_id, cost) {
  if (!user_id) {
    throw new Error("buyItem requires a user_id");
  }

  const currentStardust = await getStardust(user_id);
  if (currentStardust < cost) {
    return -1;
  }

  const remainingStardust = currentStardust - cost;
  await update(
    "profiles",
    user_id,
    { stardust: remainingStardust },
    { column: "user_id" },
  );

  return remainingStardust;
}

export async function getOwnedItems(user_id) {
  if (!user_id) {
    return {
      hat: 0,
      shoes: 0,
      scarf: 0,
      streak_saver: 0,
      small_hint: 0,
    };
  }

  const therow = await getById("profiles", user_id, { column: "user_id" });
  return {
    hat: therow?.hat ?? 0,
    shoes: therow?.shoes ?? 0,
    scarf: therow?.scarf ?? 0,
    streak_saver: therow?.streak_saver ?? 0,
    small_hint: therow?.small_hint ?? 0,
  };
}

export async function addOwnedItem(user_id, itemColumn, amount = 1) {
  if (!user_id) {
    throw new Error("addOwnedItem requires a user_id");
  }
  if (!SHOP_ITEM_COLUMNS.includes(itemColumn)) {
    throw new Error(`Invalid item column: ${itemColumn}`);
  }

  const ownedItems = await getOwnedItems(user_id);
  const nextCount = (ownedItems[itemColumn] ?? 0) + amount;

  await update(
    "profiles",
    user_id,
    { [itemColumn]: nextCount },
    { column: "user_id" },
  );

  return nextCount;
}
