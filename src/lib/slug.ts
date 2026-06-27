import { Lighthouse } from "@/models/Lighthouse"

const toSlug = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

export const generateUniqueSlug = async (name: string): Promise<string> => {
  const base = toSlug(name) || "farol"

  if (!(await Lighthouse.exists({ slug: base }))) return base

  for (let i = 2; i <= 99; i++) {
    const slug = `${base}-${i}`
    if (!(await Lighthouse.exists({ slug }))) return slug
  }

  throw new Error("Falha ao gerar slug único.")
}
