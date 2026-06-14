import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { update, getById } from "./database";

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
