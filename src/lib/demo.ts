export const DEMO_WEDDING_SLUGS = [
  "alex-sara",
  "neo-2077",
  "dimas-anindya",
  "adrian-nadia",
  "eleanor-xavier",
  "prasetyo-kinanti",
] as const;

export function isDemoWedding(slug?: string | null): boolean {
  if (!slug) return false;
  return (DEMO_WEDDING_SLUGS as readonly string[]).includes(slug.toLowerCase().trim());
}
