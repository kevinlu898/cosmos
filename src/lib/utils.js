import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { update, getById } from "./database";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getStardust(user_id) {
  const therow = await getById("profiles", user_id, "email");
  return therow.stardust;
}

export async function addStardust(user_id, num) {
  const currentStardust = await getStardust(user_id);
  const newStardust = currentStardust + num;
  await update("profiles", user_id, { stardust: newStardust });
}
