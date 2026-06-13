import { createBrowserClient } from "@supabase/ssr";

// Browswer client for all db calls
export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );
}

const supabase = createClient();

export { supabase };

// CRUD helpers for Supabase tables. Use this everywhere

// Create a single row, returns the inserted row.
export async function create(table, values) {
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Read a single row by primary key (defaults to `id`).
export async function getById(table, id, { column = "id" } = {}) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Read many rows with optional filters
export async function list(table, { filters = {}, orderBy, ascending = true, limit } = {}) {
  let query = supabase.from(table).select("*");

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }
  if (orderBy) query = query.order(orderBy, { ascending });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Update a row by primary key, returns the updated row.
export async function update(table, id, values, { column = "id" } = {}) {
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq(column, id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Insert or update on conflict, returns the resulting row.
export async function upsert(table, values, { onConflict } = {}) {
  const { data, error } = await supabase
    .from(table)
    .upsert(values, onConflict ? { onConflict } : undefined)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a row by primary key, returns the deleted row.
export async function remove(table, id, { column = "id" } = {}) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq(column, id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Count rows matching optional filters
export async function count(table, { filters = {} } = {}) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { count: total, error } = await query;
  if (error) throw error;
  return total ?? 0;
}